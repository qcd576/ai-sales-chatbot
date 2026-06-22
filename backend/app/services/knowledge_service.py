"""
知识库检索服务
"""
from typing import List
from sqlalchemy.orm import Session
from ..models import KnowledgeBase


def search_knowledge(db: Session, query: str, top_k: int = 5) -> List[dict]:
    """
    在知识库中搜索与查询相关的条目

    使用简单的关键词匹配（生产环境可替换为向量检索）

    Args:
        db: 数据库会话
        query: 用户查询
        top_k: 返回最相关的K条结果

    Returns:
        匹配的知识库条目列表
    """
    # 获取所有知识库条目
    all_items = db.query(KnowledgeBase).all()

    if not all_items:
        return []

    # 简单相关性评分：关键词匹配数量
    query_words = set(query.lower().split())

    scored_items = []
    for item in all_items:
        question_lower = item.question.lower()
        answer_lower = item.answer.lower()

        # 计算匹配分数
        score = 0
        for word in query_words:
            if word in question_lower:
                score += 3  # 问题匹配权重更高
            if word in answer_lower:
                score += 1  # 答案匹配权重较低

        # 额外加分：完整短语匹配
        if query.lower() in question_lower:
            score += 10
        if query.lower() in answer_lower:
            score += 5

        if score > 0:
            scored_items.append((score, item))

    # 按评分降序排列
    scored_items.sort(key=lambda x: x[0], reverse=True)

    # 返回top_k条结果
    results = []
    for score, item in scored_items[:top_k]:
        results.append({
            "question": item.question,
            "answer": item.answer,
            "category": item.category,
            "score": score,
        })

    return results


def build_knowledge_context(search_results: List[dict]) -> str:
    """
    将知识库检索结果构建为LLM上下文文本

    Args:
        search_results: search_knowledge的返回结果

    Returns:
        构造好的上下文字符串
    """
    if not search_results:
        return ""

    context_parts = []
    for i, item in enumerate(search_results, 1):
        context_parts.append(
            f"### 相关内容 {i}（分类：{item['category']}）\n"
            f"**问题**：{item['question']}\n"
            f"**回答**：{item['answer']}\n"
        )

    return "\n".join(context_parts)
