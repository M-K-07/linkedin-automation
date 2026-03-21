from fastapi import APIRouter, HTTPException
from database.db import get_db_connection
from schemas.agent import NewsAgent, NewsAgentUpdate
from scheduler.scheduler import add_schedule_job
from scheduler.jobs import run_news_agent_scheduler
import json

router = APIRouter(
    prefix="/api/agents/news-agent/schedule",
    tags=["agent"]
)

@router.post("/")
def create_news_agent(agent: NewsAgent):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            INSERT INTO news_agents 
            (clerk_id, email, areas_of_interest, interested_sources, days, hour, minute, period, created_at, updated_at) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW(), NOW())
            """,
            (agent.clerk_id, agent.email, agent.areas_of_interest, agent.interested_sources,
             agent.days, agent.hour, agent.minute, agent.period)
        )
        conn.commit()
        
        # Dynamically add the scheduled job
        add_schedule_job(
            agent.clerk_id, 
            agent.hour, 
            agent.minute, 
            agent.period, 
            agent.days
        )
    except Exception as e:
        print("Error creating news agent:", e)
        raise HTTPException(status_code=500, detail="Error creating news agent")
    finally:
        cur.close()
        conn.close()
    return {"message": "News agent created successfully"}

@router.get("/{clerk_id}")
def get_news_agent(clerk_id: str):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM news_agents WHERE clerk_id = %s", (clerk_id,))
    agent = cur.fetchone()
    cur.close()
    conn.close()
    if agent:
        return {
            "clerk_id": agent[1],
            "email": agent[2],
            "areas_of_interest": agent[3],
            "interested_sources": agent[4],
            "days": agent[5],
            "hour": agent[6],
            "minute": agent[7],
            "period": agent[8],
            "created_at": agent[9],
            "updated_at": agent[10]
        }
    print("News agent not found")
    raise HTTPException(status_code=404, detail="News agent not found")

@router.put("/{clerk_id}")
def update_news_agent(clerk_id: str, agent: NewsAgentUpdate):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            UPDATE news_agents 
            SET email = %s, areas_of_interest = %s, interested_sources = %s, days = %s, hour = %s, minute = %s, period = %s, updated_at = NOW()
            WHERE clerk_id = %s
            """,
            (agent.email, agent.areas_of_interest, agent.interested_sources,
             agent.days, agent.hour, agent.minute, agent.period, clerk_id)
        )
        conn.commit()   
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="News agent not found")
            
        # Dynamically update the scheduled job
        add_schedule_job(
            clerk_id, 
            agent.hour, 
            agent.minute, 
            agent.period, 
            agent.days
        )
    except Exception as e:
        print("Error updating news agent:", e)
        raise HTTPException(status_code=500, detail="Error updating news agent")
    finally:
        cur.close()
        conn.close()
    return {"message": "News agent updated successfully"}

# Manual Execution Endpoint
@router.post("/run/{clerk_id}")
def run_news_agent_now(clerk_id: str):
    try:
        # Run CrewAI synchronously and wait for the final drafted post
        result = run_news_agent_scheduler(clerk_id)
        
        if not result or result == "No schedule found for the given user.":
            raise HTTPException(status_code=400, detail="Agent is not fully configured. Please schedule it first.")
        
        if not isinstance(result, str):
            try:
                result_str = json.dumps(result.__dict__)
            except Exception:
                result_str = str(result)
        else:
            result_str = result

        return {"message": "Agent execution completed successfully", "content": result_str}
    except Exception as e:
        print("Error executing agent manually:", e)
        raise HTTPException(status_code=500, detail=str(e))
