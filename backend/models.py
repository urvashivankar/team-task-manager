from pydantic import BaseModel, EmailStr, Field, BeforeValidator
from typing import Optional, List, Annotated
from datetime import datetime
from bson import ObjectId

# Pydantic v2 compatible ObjectId handling
PyObjectId = Annotated[str, BeforeValidator(str)]

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str = "Member"

class UserCreate(UserBase):
    password: str

class UserInDB(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str
    email: EmailStr
    hashed_password: str
    role: str

class UserOut(UserBase):
    id: PyObjectId = Field(alias="_id")

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
    }

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectOut(ProjectBase):
    id: PyObjectId = Field(alias="_id")
    name: str
    description: Optional[str] = None
    created_by: PyObjectId
    members: List[PyObjectId] = []

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
    }

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = "Todo"
    deadline: Optional[datetime] = None
    project_id: PyObjectId
    assigned_to: Optional[PyObjectId] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    deadline: Optional[datetime] = None
    assigned_to: Optional[PyObjectId] = None

class TaskOut(TaskBase):
    id: PyObjectId = Field(alias="_id")
    title: str
    description: Optional[str] = None
    status: str
    deadline: Optional[datetime] = None
    project_id: PyObjectId
    assigned_to: Optional[PyObjectId] = None
    created_by: PyObjectId

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
    }
