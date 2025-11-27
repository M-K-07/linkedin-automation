import sys
import os
import json
# Add the parent directory (backend/) to the system path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from news_agent_crew.crew import generate_linkedin_post
from typing import Optional
from database.db import get_db_connection
from services.email_service import send_post_email

def get_user_schedule_details(clerk_id: str) -> Optional[dict]:
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT * FROM news_agents WHERE clerk_id = %s", (clerk_id,))
        row = cur.fetchone()
        if row:
            columns = [desc[0] for desc in cur.description]
            return dict(zip(columns, row))
        return None
    except Exception as e:
        print("Error fetching user schedule details:", e)
        return None
    finally:
        cur.close()
        conn.close()


def run_news_agent_scheduler(clerk_id: str) -> str:
    # Implementation of the news agent scheduler
    print("Running news agent scheduler for clerk_id:", clerk_id)
    user_schedule = get_user_schedule_details(clerk_id)
    
    if not user_schedule:
        return "No schedule found for the given user."
    
    topic = ", ".join(user_schedule.get("areas_of_interest", []))
    email = user_schedule.get("email")
    
    print("Fetched topic:", topic)
    print("Starting CrewAI workflow...")
    result = generate_linkedin_post(topic)
    
    if not isinstance(result, str):
        try:
            result_str = json.dumps(result.__dict__)  # convert attributes to JSON
        except Exception as e:
            print("Error converting result to string:", e)
            result_str = str(result)
    else:
        result_str = result
    
    
    send_post_email(email, result_str, topic)
    print("Email sent to:", email)
    
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("INSERT INTO drafts (clerk_id, content, agent_type, created_at, updated_at) VALUES (%s, %s, %s, NOW(), NOW())",
                    (clerk_id, result_str, "news_agent"))
        conn.commit()
    except Exception as e:
        print("Error saving draft:", e)
    finally:
        cur.close()
        conn.close()

    return result



if __name__ == "__main__":
    clerk_id = "user_34azAQJcRlf0DCd4IS0wHyu9NRN"
    result = run_news_agent_scheduler(clerk_id)
    print("Scheduler Result:", result)