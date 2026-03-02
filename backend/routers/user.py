from fastapi import APIRouter, HTTPException
from database.db import get_db_connection
from schemas.user import User

router = APIRouter(
    prefix="/api/user",
    tags=["user"]
)

@router.get("/{clerk_id}")
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

@router.post("/")
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

@router.put("/{clerk_id}")
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
