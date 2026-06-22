"""
FastAPI 应用主入口
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import init_db
from .routes import chat, session, knowledge

# 创建FastAPI应用
app = FastAPI(
    title="智选科技 AI客服聊天机器人",
    description="基于DeepSeek大模型的销售/售后服务AI聊天机器人API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS中间件（允许前端跨域访问）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境应限制具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(chat.router)
app.include_router(session.router)
app.include_router(knowledge.router)


@app.on_event("startup")
def on_startup():
    """应用启动时初始化数据库"""
    init_db()


@app.get("/")
@app.get("/api/")
def root():
    """健康检查"""
    return {
        "name": "智选科技 AI客服聊天机器人",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
    }
