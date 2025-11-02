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

if __name__ == "__main__":
    create_user_table()
    
