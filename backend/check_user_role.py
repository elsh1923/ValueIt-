import asyncio
import sys
import os
import traceback

# Ensure the project root is in sys.path
script_dir = os.path.dirname(os.path.abspath(__file__))
if script_dir not in sys.path:
    sys.path.append(script_dir)

from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.models import User

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
    except Exception:
        print("An error occurred during role check:")
        traceback.print_exc()
