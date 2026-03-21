from fastapi import FastAPI, HTTPException
from database.db import get_db_connection
from fastapi.middleware.cors import CORSMiddleware
from routers import user, agent, history

from contextlib import asynccontextmanager
from scheduler.scheduler import start_scheduler, scheduler, add_schedule_job

@asynccontextmanager
async def lifespan(app: FastAPI):
    start_scheduler()
    yield
    scheduler.shutdown()

app = FastAPI(lifespan=lifespan)

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

app.include_router(user.router)
app.include_router(agent.router)
app.include_router(history.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)