from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, projects, tasks, users

app = FastAPI(title="Team Task Manager API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://team-task-manager-xm4d.vercel.app",
        "https://team-task-manager-xm4d.vercel.app/",
        "http://localhost:5173",
        "http://localhost:5173/",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Content-Type", "Authorization", "Accept", "X-Requested-With"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(projects.router, prefix="/api")
app.include_router(tasks.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to Team Task Manager API"}
