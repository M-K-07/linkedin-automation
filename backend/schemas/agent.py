from pydantic import BaseModel
from typing import List

class NewsAgent(BaseModel):
    clerk_id: str
    email: str
    areas_of_interest: List[str]
    interested_sources: List[str]
    days: List[str]
    hour: int
    minute: int
    period: str

class NewsAgentUpdate(BaseModel):
    email: str
    areas_of_interest: List[str]
    interested_sources: List[str]
    days: List[str]
    hour: int
    minute: int
    period: str
