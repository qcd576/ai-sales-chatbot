"""
FastAPI 应用主入口
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

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
    allow_origins=["*"],
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


@app.get("/api/")
def api_root():
    """API健康检查"""
    return {
        "name": "智选科技 AI客服聊天机器人",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
    }

# ============ 生产环境：提供前端静态文件 ============
FRONTEND_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "frontend", "dist")

if os.path.exists(FRONTEND_DIR):
    # 挂载静态资源 (JS, CSS, 图片等)
    assets_dir = os.path.join(FRONTEND_DIR, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    # PWA静态文件
    for fname in ["manifest.json", "sw.js", "icon-192.png", "icon-512.png", "vite.svg"]:
        fpath = os.path.join(FRONTEND_DIR, fname)
        if os.path.exists(fpath):
            # Use default arg to capture current value
            def make_handler(fp):
                async def handler():
                    return FileResponse(fp)
                return handler
            app.get(f"/{fname}")(make_handler(fpath))

    # SPA fallback: 所有非API路由返回 index.html
    @app.get("/{path:path}")
    async def spa_fallback(path: str):
        """前端SPA路由回退 - 所有非API路径返回index.html"""
        # 尝试提供静态文件
        file_path = os.path.join(FRONTEND_DIR, path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        # SPA回退
        index_path = os.path.join(FRONTEND_DIR, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return {"error": "Frontend not available"}
else:
    @app.get("/")
    def root():
        return {
            "name": "智选科技 AI客服聊天机器人",
            "version": "1.0.0",
            "status": "running",
            "docs": "/docs",
        }
