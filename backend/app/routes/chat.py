"""
聊天API路由
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime

from ..database import get_db
from ..models import Conversation, Message, generate_session_id
from ..schemas import ChatRequest, ChatResponse
from ..services.llm_service import call_deepseek, build_messages
from ..services.knowledge_service import search_knowledge, build_knowledge_context

router = APIRouter(prefix="/api/chat", tags=["聊天"])


@router.post("/send", response_model=ChatResponse)
async def send_message(request: ChatRequest, db: Session = Depends(get_db)):
    """
    发送消息并获取AI回复

    - 如果是新会话（无session_id），自动创建会话
    - 如果有session_id，追加到已有会话
    - 结合知识库检索增强回复质量
    """
    # 1. 处理会话：无session_id则创建新会话
    session_id = request.session_id
    if not session_id:
        session_id = generate_session_id()
        conversation = Conversation(session_id=session_id)
        db.add(conversation)
        db.flush()
    else:
        conversation = db.query(Conversation).filter_by(session_id=session_id).first()
        if not conversation:
            # session_id无效，创建新会话
            conversation = Conversation(session_id=session_id)
            db.add(conversation)
            db.flush()

    # 自动设置会话标题（取用户第一条消息的前30字）
    if conversation.title == "新对话":
        conversation.title = request.message[:30] + ("..." if len(request.message) > 30 else "")

    # 2. 保存用户消息
    user_msg = Message(session_id=session_id, role="user", content=request.message)
    db.add(user_msg)

    # 3. 获取历史对话
    history_msgs = (
        db.query(Message)
        .filter_by(session_id=session_id)
        .order_by(Message.created_at.asc())
        .all()
    )
    history = [{"role": m.role, "content": m.content} for m in history_msgs]

    # 4. 知识库检索
    search_results = search_knowledge(db, request.message, top_k=3)
    knowledge_context = build_knowledge_context(search_results)

    # 5. 构建消息并调用LLM
    messages = build_messages(request.message, history, knowledge_context)
    ai_response = await call_deepseek(messages)

    # 6. 保存AI回复
    ai_msg = Message(session_id=session_id, role="assistant", content=ai_response)
    db.add(ai_msg)

    # 7. 更新会话时间
    conversation.updated_at = datetime.utcnow()

    db.commit()

    return ChatResponse(session_id=session_id, message=ai_response, role="assistant")
