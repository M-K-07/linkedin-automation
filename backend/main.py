from fastapi import FastAPI, HTTPException
from database.db import get_db_connection
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # your Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hello World"}

@app.get('/api/user/{clerk_id}')
def get_user(clerk_id: str):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT clerk_id, email, role, full_name FROM users WHERE clerk_id = %s", (clerk_id,))
    user = cur.fetchone()
    cur.close()
    conn.close()
    if user:
        return {"clerk_id": clerk_id, "email": user[1], "role": user[2], "full_name": user[3]}
    print("User not found")
    raise HTTPException(status_code=404, detail="User not found")

class User(BaseModel):
    clerk_id: str
    email: str
    full_name: str
    role: str

@app.post('/api/user/')
def create_user(user: User):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("INSERT INTO users (email, role, full_name, clerk_id) VALUES (%s, %s, %s, %s)",
                    (user.email, user.role, user.full_name, user.clerk_id))
        conn.commit()
    except Exception as e:
        print("Error creating user:", e)
        raise HTTPException(status_code=500, detail="Error creating user")
    finally:
        cur.close()
        conn.close()
    return {"message": "User created successfully"}

@app.put('/api/user/{clerk_id}')
def update_user(clerk_id: str, user: User):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("UPDATE users SET email = %s, role = %s, full_name = %s WHERE clerk_id = %s",
                    (user.email, user.role, user.full_name, clerk_id))
        conn.commit()
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="User not found")
    except Exception as e:
        print("Error updating user:", e)
        raise HTTPException(status_code=500, detail="Error updating user")
    finally:
        cur.close()
        conn.close()
    return {"message": "User updated successfully"}


class NewsAgent(BaseModel):
    clerk_id: str
    email: str
    areas_of_interest: List[str]
    interested_sources: List[str]
    days: List[str]
    hour: int
    minute: int
    period: str


@app.post('/api/agents/news-agent/schedule')
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
    except Exception as e:
        print("Error creating news agent:", e)
        raise HTTPException(status_code=500, detail="Error creating news agent")
    finally:
        cur.close()
        conn.close()
    return {"message": "News agent created successfully"}

@app.get('/api/agents/news-agent/schedule/{clerk_id}')
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


class NewsAgentUpdate(BaseModel):
    email: str
    areas_of_interest: List[str]
    interested_sources: List[str]
    days: List[str]
    hour: int
    minute: int
    period: str

@app.put('/api/agents/news-agent/schedule/{clerk_id}')
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
    except Exception as e:
        print("Error updating news agent:", e)
        raise HTTPException(status_code=500, detail="Error updating news agent")
    finally:
        cur.close()
        conn.close()
    return {"message": "News agent updated successfully"}   

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)