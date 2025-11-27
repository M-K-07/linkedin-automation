import os, sys
# sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from .jobs import run_news_agent_scheduler
from apscheduler.schedulers.background import BackgroundScheduler
from database.db import get_db_connection

scheduler = BackgroundScheduler()

def get_all_schedules():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM news_agents")
    rows = cur.fetchall()
    cols = [d[0] for d in cur.description]
    cur.close()
    conn.close()
    return [dict(zip(cols, row)) for row in rows]

def start_scheduler():
    schedules = get_all_schedules()

    for s in schedules:
        hour = int(s["hour"])
        minute = int(s["minute"])
        period = s["period"]
        days=s["days"]  # Currently unused, assuming weekly on Thursday

        if period.upper() == "PM" and hour != 12:
            hour += 12
        elif period.upper() == "AM" and hour == 12:
            hour = 0
        days_to_run = ",".join([d.lower() for d in days]) if days else "*"
        
        scheduler.add_job(
            run_news_agent_scheduler,
            "cron",
            id=f"job_{s['clerk_id']}",
            args=[s['clerk_id']],
            minute=minute,
            hour=hour,
            day_of_week=days_to_run
        )

    scheduler.start()
    print("✅ Scheduler started with existing jobs.")
    
if __name__ == "__main__":
    start_scheduler()
    print("Scheduler is running... Press Ctrl+C to stop.")

    # Keep script alive so BackgroundScheduler jobs run
    try:
        import time
        while True:
            time.sleep(10)
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()
        print("Scheduler stopped.")