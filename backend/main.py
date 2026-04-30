from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, projects, tasks, users

app = FastAPI(title="Team Task Manager API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(projects.router, prefix="/api")
app.include_router(tasks.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to Team Task Manager API"}
