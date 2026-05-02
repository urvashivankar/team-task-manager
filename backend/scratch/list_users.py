import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def list_users():
    uri = "mongodb+srv://urvashiparmar1603_db_user:team_task_manager@teamtaskmanager.bovya8i.mongodb.net/"
    client = AsyncIOMotorClient(uri)
    db = client["team_task_manager"]
    users = await db["users"].find().to_list(100)
    
    print(f"{'Name':<20} | {'Email':<30} | {'Role':<10}")
    print("-" * 65)
    for user in users:
        print(f"{user.get('name', 'N/A'):<20} | {user.get('email', 'N/A'):<30} | {user.get('role', 'N/A'):<10}")

if __name__ == "__main__":
    asyncio.run(list_users())
