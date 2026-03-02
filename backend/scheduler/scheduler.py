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

def add_schedule_job(clerk_id, hour, minute, period, days):
    hour = int(hour)
    minute = int(minute)
    
    if period.upper() == "PM" and hour != 12:
        hour += 12
    elif period.upper() == "AM" and hour == 12:
        hour = 0
    days_to_run = ",".join([d.lower() for d in days]) if days else "*"
    
    job_id = f"job_{clerk_id}"
    
    # Remove existing job if it exists to allow updates
    if scheduler.get_job(job_id):
        scheduler.remove_job(job_id)
    
    scheduler.add_job(
        run_news_agent_scheduler,
        "cron",
        id=job_id,
        args=[clerk_id],
        minute=minute,
        hour=hour,
        day_of_week=days_to_run
    )

def start_scheduler():
    schedules = get_all_schedules()

    for s in schedules:
        add_schedule_job(s['clerk_id'], s['hour'], s['minute'], s['period'], s['days'])

    scheduler.start()
    print("✅ Scheduler started with existing jobs.")