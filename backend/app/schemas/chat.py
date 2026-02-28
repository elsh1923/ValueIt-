from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class ChatMessageBase(BaseModel):
    project_id: int
    content: str

class ChatMessageCreate(ChatMessageBase):
    pass

class ChatMessageInDBBase(ChatMessageBase):
    id: int
    sender_id: int
    sender_name: Optional[str] = None
    sender_avatar: Optional[str] = None
    timestamp: datetime

    class Config:
        from_attributes = True

class ChatMessage(ChatMessageInDBBase):
    pass
