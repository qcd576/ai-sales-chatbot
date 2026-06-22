"""
启动脚本
用法: python run.py
"""
import uvicorn
from app.config import HOST, PORT

if __name__ == "__main__":
    print("=" * 60)
    print("  智选科技 AI客服聊天机器人 - 后端服务")
    print("=" * 60)
    print(f"  启动地址: http://{HOST}:{PORT}")
    print(f"  API文档:  http://{HOST}:{PORT}/docs")
    print("=" * 60)
    uvicorn.run(
        "app.main:app",
        host=HOST,
        port=PORT,
        reload=True,
        log_level="info",
    )
