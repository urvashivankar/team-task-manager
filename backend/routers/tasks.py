from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from models import TaskCreate, TaskOut, TaskUpdate
from auth import get_current_user, get_current_admin_user
from database import db
from bson import ObjectId

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.post("/", response_model=TaskOut)
async def create_task(task: TaskCreate, current_user: dict = Depends(get_current_admin_user)):
    project = await db["projects"].find_one({"_id": ObjectId(task.project_id)})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    task_dict = task.model_dump()
    task_dict["created_by"] = ObjectId(current_user["_id"])
    if task.assigned_to:
        assigned_user_id = ObjectId(task.assigned_to)
        task_dict["assigned_to"] = assigned_user_id
        
        # Auto-add assigned user to project members if not already there
        if assigned_user_id not in project.get("members", []):
            await db["projects"].update_one(
                {"_id": ObjectId(task.project_id)},
                {"$push": {"members": assigned_user_id}}
            )
    task_dict["project_id"] = ObjectId(task.project_id)
    
    new_task = await db["tasks"].insert_one(task_dict)
    created_task = await db["tasks"].find_one({"_id": new_task.inserted_id})
    return created_task

@router.get("/", response_model=List[TaskOut])
async def get_tasks(
    project_id: Optional[str] = None, 
    status: Optional[str] = None,
    assigned_to_me: bool = False,
    current_user: dict = Depends(get_current_user)
):
    query = {}
    if project_id:
        query["project_id"] = ObjectId(project_id)
    if status:
        query["status"] = status
    if assigned_to_me:
        query["assigned_to"] = ObjectId(current_user["_id"])
        
    if current_user["role"] != "Admin":
        # Member can only see tasks in projects they belong to
        user_projects = await db["projects"].find({"members": ObjectId(current_user["_id"])}).to_list(100)
        project_ids = [p["_id"] for p in user_projects]
        
        if "project_id" in query and query["project_id"] not in project_ids:
             raise HTTPException(status_code=403, detail="Not a member of this project")
        
        if "project_id" not in query:
             query["project_id"] = {"$in": project_ids}

    tasks = await db["tasks"].find(query).to_list(1000)
    
    # Enrich tasks with member names
    for t in tasks:
        t["_id"] = str(t["_id"])
        if t.get("project_id"):
            t["project_id"] = str(t["project_id"])
        if t.get("created_by"):
            t["created_by"] = str(t["created_by"])
        if t.get("assigned_to"):
            assigned_id = t["assigned_to"]
            t["assigned_to"] = str(assigned_id)
            assigned_user = await db["users"].find_one({"_id": ObjectId(assigned_id)}, {"name": 1})
            if assigned_user:
                t["assigned_name"] = assigned_user["name"]
        
    return tasks

@router.put("/{id}", response_model=TaskOut)
async def update_task(id: str, task_update: TaskUpdate, current_user: dict = Depends(get_current_user)):
    task = await db["tasks"].find_one({"_id": ObjectId(id)})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    update_data = {k: v for k, v in task_update.model_dump().items() if v is not None}
    
    if current_user["role"] != "Admin":
        # Members can only update status
        allowed_updates = {}
        if "status" in update_data:
            allowed_updates["status"] = update_data["status"]
        if not allowed_updates:
             raise HTTPException(status_code=403, detail="Members can only update task status")
        update_data = allowed_updates
    else:
        if "assigned_to" in update_data:
             update_data["assigned_to"] = ObjectId(update_data["assigned_to"])
             
    if update_data:
        await db["tasks"].update_one({"_id": ObjectId(id)}, {"$set": update_data})
        
    updated_task = await db["tasks"].find_one({"_id": ObjectId(id)})
    return updated_task

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(id: str, current_user: dict = Depends(get_current_admin_user)):
    result = await db["tasks"].delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    return None
