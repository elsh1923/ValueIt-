import asyncio
import sys
import os
import traceback

# Ensure the project root is in sys.path
# This works regardless of where the script is called from
script_dir = os.path.dirname(os.path.abspath(__file__))
if script_dir not in sys.path:
    sys.path.append(script_dir)

from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.models import User # Importing from app.models ensures all models are registered

async def approve_all():
    print("Starting user approval process...")
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User))
        users = result.scalars().all()
        count = 0
        for user in users:
            if not user.is_approved:
                user.is_approved = True
                print(f"Approving user: {user.email}")
                count += 1
            else:
                print(f"User {user.email} already approved.")
        
        if count > 0:
            await session.commit()
            print(f"Successfully approved {count} users.")
        else:
            print("No pending users found.")

if __name__ == "__main__":
    try:
        asyncio.run(approve_all())
    except Exception:
        print("An error occurred during user approval:")
        traceback.print_exc()
