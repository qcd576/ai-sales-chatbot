from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# ============ 聊天相关 ============
class ChatRequest(BaseModel):
    session_id: Optional[str] = Field(None, description="会话ID，不传则创建新会话")
    message: str = Field(..., min_length=1, max_length=5000, description="用户消息")


class ChatResponse(BaseModel):
    session_id: str
    message: str
    role: str = "assistant"


# ============ 会话相关 ============
class SessionInfo(BaseModel):
    session_id: str
    title: str
    created_at: datetime
    updated_at: datetime
    message_count: int = 0

    class Config:
        from_attributes = True


class SessionCreate(BaseModel):
    title: Optional[str] = "新对话"


class MessageInfo(BaseModel):
    id: int
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


# ============ 知识库相关 ============
class KnowledgeItem(BaseModel):
    id: int
    question: str
    answer: str
    category: str
    created_at: datetime

    class Config:
        from_attributes = True


class KnowledgeCreate(BaseModel):
    question: str = Field(..., min_length=1, max_length=1000, description="问题")
    answer: str = Field(..., min_length=1, max_length=5000, description="回答")
    category: str = Field(..., min_length=1, max_length=50, description="分类")


class KnowledgeUpdate(BaseModel):
    question: Optional[str] = Field(None, min_length=1, max_length=1000)
    answer: Optional[str] = Field(None, min_length=1, max_length=5000)
    category: Optional[str] = Field(None, min_length=1, max_length=50)


class KnowledgeSearchRequest(BaseModel):
    query: str = Field(..., min_length=1, description="搜索关键词")


# ============ 通用响应 ============
class APIResponse(BaseModel):
    success: bool = True
    message: str = "操作成功"
    data: Optional[object] = None
