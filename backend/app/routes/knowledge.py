"""
知识库管理API路由
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from ..database import get_db
from ..models import KnowledgeBase
from ..schemas import KnowledgeItem, KnowledgeCreate, KnowledgeUpdate

router = APIRouter(prefix="/api/knowledge", tags=["知识库管理"])


@router.get("", response_model=list[KnowledgeItem])
def list_knowledge(
    category: Optional[str] = Query(None, description="按分类筛选"),
    search: Optional[str] = Query(None, description="关键词搜索"),
    db: Session = Depends(get_db),
):
    """获取知识库列表，支持按分类筛选和关键词搜索"""
    query = db.query(KnowledgeBase)

    if category:
        query = query.filter_by(category=category)

    if search:
        query = query.filter(
            KnowledgeBase.question.contains(search)
            | KnowledgeBase.answer.contains(search)
        )

    items = query.order_by(KnowledgeBase.created_at.desc()).all()
    return items


@router.get("/categories", response_model=list[str])
def list_categories(db: Session = Depends(get_db)):
    """获取所有知识库分类"""
    categories = (
        db.query(KnowledgeBase.category)
        .distinct()
        .order_by(KnowledgeBase.category)
        .all()
    )
    return [c[0] for c in categories]


@router.post("", response_model=KnowledgeItem)
def create_knowledge(item: KnowledgeCreate, db: Session = Depends(get_db)):
    """新增知识库条目"""
    kb_item = KnowledgeBase(
        question=item.question,
        answer=item.answer,
        category=item.category,
    )
    db.add(kb_item)
    db.commit()
    db.refresh(kb_item)
    return kb_item


@router.put("/{item_id}", response_model=KnowledgeItem)
def update_knowledge(item_id: int, item: KnowledgeUpdate, db: Session = Depends(get_db)):
    """更新知识库条目"""
    kb_item = db.query(KnowledgeBase).filter_by(id=item_id).first()
    if not kb_item:
        raise HTTPException(status_code=404, detail="条目不存在")

    if item.question is not None:
        kb_item.question = item.question
    if item.answer is not None:
        kb_item.answer = item.answer
    if item.category is not None:
        kb_item.category = item.category

    db.commit()
    db.refresh(kb_item)
    return kb_item


@router.delete("/{item_id}")
def delete_knowledge(item_id: int, db: Session = Depends(get_db)):
    """删除知识库条目"""
    kb_item = db.query(KnowledgeBase).filter_by(id=item_id).first()
    if not kb_item:
        raise HTTPException(status_code=404, detail="条目不存在")

    db.delete(kb_item)
    db.commit()
    return {"success": True, "message": "条目已删除"}
