from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from models import ProjectCreate, ProjectOut
from auth import get_current_user, get_current_admin_user
from database import db
from bson import ObjectId

router = APIRouter(prefix="/projects", tags=["projects"])

@router.post("/", response_model=ProjectOut)
async def create_project(project: ProjectCreate, current_user: dict = Depends(get_current_admin_user)):
    project_dict = project.model_dump()
    project_dict["created_by"] = ObjectId(current_user["_id"])
    project_dict["members"] = [ObjectId(current_user["_id"])] # Add creator as member by default
    
    new_project = await db["projects"].insert_one(project_dict)
    created_project = await db["projects"].find_one({"_id": new_project.inserted_id})
    return created_project

@router.get("/", response_model=List[dict]) # Use dict to allow extra fields
async def get_projects(current_user: dict = Depends(get_current_user)):
    if current_user["role"] == "Admin":
        projects = await db["projects"].find().to_list(100)
    else:
        projects = await db["projects"].find({"members": ObjectId(current_user["_id"])}).to_list(100)
    
    # Enrich projects with member details for the UI
    for p in projects:
        p["_id"] = str(p["_id"])
        if "created_by" in p:
            p["created_by"] = str(p["created_by"])
        
        member_ids = p.get("members", [])
        # Convert the members list to strings for serialization
        p["members"] = [str(m) for m in member_ids]
        
        members_data = await db["users"].find({"_id": {"$in": member_ids}}, {"name": 1}).to_list(100)
        p["members_details"] = [{"id": str(m["_id"]), "name": m["name"]} for m in members_data]
        
        # Count tasks for this project
        task_count = await db["tasks"].count_documents({"project_id": ObjectId(p["_id"])})
        p["task_count"] = task_count
        
    return projects

@router.get("/{id}", response_model=ProjectOut)
async def get_project(id: str, current_user: dict = Depends(get_current_user)):
    project = await db["projects"].find_one({"_id": ObjectId(id)})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if current_user["role"] != "Admin" and ObjectId(current_user["_id"]) not in project.get("members", []):
        raise HTTPException(status_code=403, detail="Not a member of this project")
    
    return project

@router.post("/{id}/members/{user_id}", response_model=ProjectOut)
async def add_member(id: str, user_id: str, current_user: dict = Depends(get_current_admin_user)):
    project = await db["projects"].find_one({"_id": ObjectId(id)})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    user_to_add = await db["users"].find_one({"_id": ObjectId(user_id)})
    if not user_to_add:
        raise HTTPException(status_code=404, detail="User not found")
    
    if ObjectId(user_id) not in project.get("members", []):
        await db["projects"].update_one(
            {"_id": ObjectId(id)},
            {"$push": {"members": ObjectId(user_id)}}
        )
    
    updated_project = await db["projects"].find_one({"_id": ObjectId(id)})
    return updated_project

@router.delete("/{id}/members/{user_id}", response_model=ProjectOut)
async def remove_member(id: str, user_id: str, current_user: dict = Depends(get_current_admin_user)):
    project = await db["projects"].find_one({"_id": ObjectId(id)})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Don't allow removing the owner/creator if you want, but for now simple remove
    await db["projects"].update_one(
        {"_id": ObjectId(id)},
        {"$pull": {"members": ObjectId(user_id)}}
    )
    
    updated_project = await db["projects"].find_one({"_id": ObjectId(id)})
    return updated_project
