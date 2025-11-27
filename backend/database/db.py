import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

def get_db_connection():
    return psycopg2.connect(DATABASE_URL)
def create_user_table():
    conn = get_db_connection()
    cur = conn.cursor()  
    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        clerk_id VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255),
        full_name VARCHAR(255),
        role VARCHAR(100)
    );
    """)

    conn.commit()
    cur.close()
    conn.close()

    print("✅ Users table created successfully!")

def create_news_agent_table():
    conn = get_db_connection()
    cur = conn.cursor()  
    cur.execute("""
    CREATE TABLE IF NOT EXISTS news_agents (
        id SERIAL PRIMARY KEY,
        clerk_id VARCHAR(255) UNIQUE NOT NULL REFERENCES users(clerk_id),
        email VARCHAR(255),
        areas_of_interest TEXT[],
        interested_sources TEXT[],
        days TEXT[],
        hour INT,
        minute INT,
        period VARCHAR(2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    conn.commit()
    cur.close()
    conn.close()

    print("✅ News agents table created successfully!")

def create_drafts_table():
    conn = get_db_connection()
    cur = conn.cursor()  
    cur.execute("""
    CREATE TABLE IF NOT EXISTS drafts (
        id SERIAL PRIMARY KEY,
        clerk_id VARCHAR(255) REFERENCES news_agents(clerk_id),
        content TEXT,
        agent_type VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """
)

    conn.commit()
    cur.close()
    conn.close()

    print("✅ Drafts table created successfully!")

if __name__ == "__main__":
    create_user_table()
    create_news_agent_table()
    create_drafts_table()