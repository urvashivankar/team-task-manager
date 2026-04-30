from fastapi import APIRouter, Depends, HTTPException
from typing import List
from models import UserOut
from auth import get_current_user, get_current_admin_user
from database import db

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/", response_model=List[UserOut])
async def get_all_users(current_user: dict = Depends(get_current_user)):
    # Let anyone see users for the UI dropdowns.
    users = await db["users"].find().to_list(1000)
    return users
