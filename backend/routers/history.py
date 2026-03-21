import json
from fastapi import APIRouter, HTTPException
from database.db import get_db_connection
from news_agent_crew.crew import generate_linkedin_post

router = APIRouter(
    prefix="/api/history",
    tags=["history"]
)

@router.get("/{clerk_id}")
def get_history(clerk_id: str):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            SELECT d.id, d.clerk_id, d.content, d.agent_type, d.created_at, d.updated_at, n.areas_of_interest
            FROM drafts d
            LEFT JOIN news_agents n ON d.clerk_id = n.clerk_id
            WHERE d.clerk_id = %s 
            ORDER BY d.created_at DESC
        """, (clerk_id,))
        drafts = cur.fetchall()
        
        result = []
        for draft in drafts:
            result.append({
                "id": draft[0],
                "clerk_id": draft[1],
                "content": draft[2],
                "agent_type": draft[3],
                "created_at": draft[4],
                "updated_at": draft[5],
                "areas_of_interest": draft[6] if len(draft) > 6 and draft[6] else []
            })
        return result
    except Exception as e:
        print("Error fetching history:", e)
        raise HTTPException(status_code=500, detail="Error fetching history data")
    finally:
        cur.close()
        conn.close()

from pydantic import BaseModel

class RegenerateRequest(BaseModel):
    prompt: str

@router.post("/{draft_id}/regenerate")
def regenerate_draft(draft_id: int, req: RegenerateRequest):
    conn = get_db_connection()
    cur = conn.cursor()
    from news_agent_crew.crew import rewrite_linkedin_post
    try:
        # 1. Fetch the draft
        cur.execute("SELECT clerk_id, agent_type, content FROM drafts WHERE id = %s", (draft_id,))
        draft = cur.fetchone()
        if not draft:
            raise HTTPException(status_code=404, detail="Draft not found")
            
        clerk_id = draft[0]
        agent_type = draft[1]
        existing_content = draft[2]
        
        # We only support regenerating news_agent posts right now
        if agent_type != "news_agent":
            raise HTTPException(status_code=400, detail=f"Cannot regenerate agent type: {agent_type}")
            
        # 3. Trigger Crew AI content rewrite
        print(f"Rewriting draft {draft_id} with prompt: {req.prompt}")
        result = rewrite_linkedin_post(existing_content, req.prompt)
        
        # Process result
        if not isinstance(result, str):
            try:
                result_str = json.dumps(result.__dict__)
            except Exception:
                result_str = str(result)
        else:
            result_str = result
            
        # 4. Update the existing draft directly
        cur.execute("""
            UPDATE drafts 
            SET content = %s, updated_at = NOW() 
            WHERE id = %s
        """, (result_str, draft_id))
        conn.commit()
        
        return {"id": draft_id, "content": result_str, "message": "Draft rewritten successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error regenerating draft {draft_id}:", e)
        raise HTTPException(status_code=500, detail="Error regenerating post")
    finally:
        cur.close()
        conn.close()
