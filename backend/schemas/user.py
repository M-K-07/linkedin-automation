from pydantic import BaseModel

class User(BaseModel):
    clerk_id: str
    email: str
    full_name: str
    role: str
