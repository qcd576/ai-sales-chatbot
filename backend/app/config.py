import os
from dotenv import load_dotenv

load_dotenv()

# DeepSeek API 配置
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "your-api-key-here")
DEEPSEEK_BASE_URL = os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com")
DEEPSEEK_MODEL = os.getenv("DEEPSEEK_MODEL", "deepseek-chat")

# 数据库配置
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./data/chatbot.db")

# 服务配置
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))

# 品牌信息
BRAND_NAME = "智选科技"
BRAND_DESC = "智选科技是一家专注于消费电子产品的电商品牌，主营智能手机、笔记本电脑、平板电脑、智能穿戴设备等产品。"
