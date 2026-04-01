import os
import sys

# Add current directory to path
sys.path.append(os.getcwd())

try:
    from app.models.notification import Notification
    print("Successfully imported Notification")
except Exception as e:
    print(f"Failed to import Notification: {e}")
    import traceback
    traceback.print_exc()
