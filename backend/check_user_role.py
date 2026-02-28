import asyncio
import sys
import os

# Ensure backend directory is in sys.path
sys.path.append(os.getcwd())

from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.models.user import User

async def check_roles():
    print("Checking user roles...")
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User))
        users = result.scalars().all()
        print(f"Found {len(users)} users.")
        for user in users:
            print(f"---")
            print(f"Email: {user.email}")
            print(f"Role (Raw): {user.role}")
            print(f"Role (Value): {user.role.value if hasattr(user.role, 'value') else user.role}")
            print(f"---")

if __name__ == "__main__":
    try:
        asyncio.run(check_roles())
    except Exception as e:
        print(f"Error: {e}")
