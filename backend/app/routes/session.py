"""
会话管理API路由
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from ..database import get_db
from ..models import Conversation, Message
from ..schemas import SessionInfo, MessageInfo

router = APIRouter(prefix="/api/sessions", tags=["会话管理"])


@router.get("", response_model=list[SessionInfo])
def list_sessions(db: Session = Depends(get_db)):
    """获取所有会话列表，按更新时间倒序"""
    conversations = (
        db.query(Conversation)
        .order_by(Conversation.updated_at.desc())
        .all()
    )

    result = []
    for conv in conversations:
        msg_count = (
            db.query(func.count(Message.id))
            .filter_by(session_id=conv.session_id)
            .scalar()
        )
        result.append(
            SessionInfo(
                session_id=conv.session_id,
                title=conv.title,
                created_at=conv.created_at,
                updated_at=conv.updated_at,
                message_count=msg_count or 0,
            )
        )

    return result


@router.post("", response_model=SessionInfo)
def create_session(db: Session = Depends(get_db)):
    """创建新会话"""
    from ..models import generate_session_id

    session_id = generate_session_id()
    conversation = Conversation(session_id=session_id)
    db.add(conversation)
    db.commit()
    db.refresh(conversation)

    return SessionInfo(
        session_id=conversation.session_id,
        title=conversation.title,
        created_at=conversation.created_at,
        updated_at=conversation.updated_at,
        message_count=0,
    )


@router.get("/{session_id}/messages", response_model=list[MessageInfo])
def get_messages(session_id: str, db: Session = Depends(get_db)):
    """获取指定会话的消息历史"""
    conversation = db.query(Conversation).filter_by(session_id=session_id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="会话不存在")

    messages = (
        db.query(Message)
        .filter_by(session_id=session_id)
        .order_by(Message.created_at.asc())
        .all()
    )

    return messages


@router.delete("/{session_id}")
def delete_session(session_id: str, db: Session = Depends(get_db)):
    """删除指定会话"""
    conversation = db.query(Conversation).filter_by(session_id=session_id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="会话不存在")

    db.delete(conversation)
    db.commit()

    return {"success": True, "message": "会话已删除"}
