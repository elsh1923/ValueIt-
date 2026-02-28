"""
Test script to verify notification creation works
"""
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import async_session_maker
from app.models.notification import Notification
from app.models.user import User
from app.models.project import Project

async def test_notification_creation():
    async with async_session_maker() as db:
        # Get a user to test with
        stmt = select(User).limit(1)
        result = await db.execute(stmt)
        user = result.scalars().first()
        
        if not user:
            print("No users found in database!")
            return
            
        print(f"Testing with user: {user.email} (ID: {user.id})")
        
        # Create a test notification
        notif = Notification(
            user_id=user.id,
            title="Test Notification",
            message="This is a test notification to verify the system works."
        )
        db.add(notif)
        await db.commit()
        await db.refresh(notif)
        
        print(f"✓ Created notification ID: {notif.id}")
        
        # Verify it was created
        stmt = select(Notification).where(Notification.id == notif.id)
        result = await db.execute(stmt)
        found = result.scalars().first()
        
        if found:
            print(f"✓ Notification verified in database")
            print(f"  Title: {found.title}")
            print(f"  Message: {found.message}")
            print(f"  User ID: {found.user_id}")
            print(f"  Is Read: {found.is_read}")
        else:
            print("✗ Notification not found after creation!")
            
        # Clean up test notification
        await db.delete(notif)
        await db.commit()
        print("✓ Test notification cleaned up")

if __name__ == "__main__":
    asyncio.run(test_notification_creation())
