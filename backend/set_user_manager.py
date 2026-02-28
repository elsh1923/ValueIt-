import asyncio
import sys
import os

# Ensure backend directory is in sys.path
sys.path.append(os.getcwd())

from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.models.user import User, UserRole

async def set_manager_role():
    print("Setting FIRST user to MANAGER...")
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User))
        user = result.scalars().first()
        
        if user:
            print(f"User found: {user.email}. Current role: {user.role}")
            user.role = UserRole.MANAGER
            await session.commit()
            print(f"Successfully updated {user.email} to MANAGER.")
        else:
            print("No users found.")

if __name__ == "__main__":
    try:
        asyncio.run(set_manager_role())
    except Exception as e:
        print(f"Error: {e}")
