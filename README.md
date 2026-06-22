# 智选科技 AI客服聊天机器人

## 📋 项目概述

本项目是为**大数据机器学习**课程开发的销售/售后服务AI聊天机器人全栈应用。基于DeepSeek大语言模型，为虚构品牌「智选科技」（消费电子产品电商）提供智能客服服务。

### 核心功能
- 🤖 **AI智能对话**：基于DeepSeek大模型，理解用户意图并生成专业回复
- 📚 **知识库增强**：30+条销售/售后Q&A知识库，RAG检索增强生成
- 💬 **多轮对话**：会话管理，支持历史对话上下文
- 🎯 **提示词工程**：精心设计的系统提示词，角色扮演+情感安抚+边界控制
- 📱 **响应式界面**：现代化聊天UI，适配PC和移动端
- ⚙️ **管理后台**：知识库条目的可视化增删改查

## 🏗️ 技术架构

```
┌─────────────────────────────────────────────────┐
│                   前端 (React)                    │
│  Chat UI  │  Admin Panel  │  Session Management  │
└──────────────────┬──────────────────────────────┘
                   │ REST API (JSON)
┌──────────────────▼──────────────────────────────┐
│               后端 (FastAPI)                      │
│  Chat Routes  │  Knowledge CRUD  │  Session API  │
│  LLM Service  │  Knowledge Search │  CORS        │
└──────────┬──────────────────┬───────────────────┘
           │                  │
    ┌──────▼──────┐   ┌──────▼──────┐
    │ DeepSeek API │   │   SQLite    │
    │  (AI模型)    │   │  (数据库)    │
    └─────────────┘   └─────────────┘
```

## 📁 项目结构

```
ai-sales-chatbot/
├── frontend/                    # React前端
│   ├── src/
│   │   ├── components/          # UI组件
│   │   │   ├── ChatWindow.tsx       # 聊天窗口
│   │   │   ├── MessageBubble.tsx    # 消息气泡
│   │   │   ├── ChatInput.tsx        # 输入框
│   │   │   ├── Sidebar.tsx          # 侧边栏
│   │   │   └── KnowledgeForm.tsx    # 知识库表单
│   │   ├── pages/
│   │   │   ├── ChatPage.tsx         # 用户聊天页
│   │   │   └── AdminPage.tsx        # 管理后台页
│   │   ├── services/api.ts         # API封装
│   │   └── types/index.ts          # 类型定义
│   ├── package.json
│   └── vite.config.ts
├── backend/                     # Python后端
│   ├── app/
│   │   ├── main.py                 # FastAPI入口
│   │   ├── config.py               # 配置管理
│   │   ├── database.py             # 数据库
│   │   ├── models.py               # ORM模型
│   │   ├── schemas.py              # Pydantic模型
│   │   ├── routes/
│   │   │   ├── chat.py             # 聊天API
│   │   │   ├── session.py          # 会话API
│   │   │   └── knowledge.py        # 知识库API
│   │   └── services/
│   │       ├── llm_service.py      # LLM服务+提示词工程
│   │       └── knowledge_service.py # 知识库检索
│   ├── data/
│   │   └── seed_knowledge.py       # 种子数据(30+条)
│   ├── requirements.txt
│   └── run.py
└── README.md
```

## 🚀 快速启动

### 1. 环境要求
- Python 3.10+
- Node.js 18+
- DeepSeek API Key（[获取地址](https://platform.deepseek.com/)）

### 2. 后端启动

```bash
cd backend

# 安装依赖
pip install -r requirements.txt

# 配置API Key（创建 .env 文件）
echo "DEEPSEEK_API_KEY=your-api-key-here" > .env

# 初始化知识库数据
python -m data.seed_knowledge

# 启动后端服务
python run.py
```

后端启动后访问：
- API服务：http://localhost:8000
- Swagger文档：http://localhost:8000/docs

### 3. 前端启动

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端启动后访问：http://localhost:5173

> **注意**：前端通过Vite代理将 `/api` 请求转发到后端 `localhost:8000`，无需额外配置。

## 🔧 环境变量

在 `backend/.env` 文件中配置：

```env
# DeepSeek API（必填，否则使用模拟回复）
DEEPSEEK_API_KEY=sk-your-api-key

# 可选配置
DEEPSEEK_MODEL=deepseek-chat
DATABASE_URL=sqlite:///./data/chatbot.db
HOST=0.0.0.0
PORT=8000
```

## 📡 API接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/chat/send | 发送消息获取AI回复 |
| GET | /api/sessions | 获取会话列表 |
| POST | /api/sessions | 创建新会话 |
| DELETE | /api/sessions/{id} | 删除会话 |
| GET | /api/sessions/{id}/messages | 获取会话消息 |
| GET | /api/knowledge | 知识库列表 |
| POST | /api/knowledge | 新增知识条目 |
| PUT | /api/knowledge/{id} | 更新知识条目 |
| DELETE | /api/knowledge/{id} | 删除知识条目 |
| GET | /api/knowledge/categories | 获取分类列表 |

## 🎯 提示词工程设计

系统提示词包含以下层次：

1. **角色定义**：你是「智选科技」AI客服助手"小智"
2. **品牌知识**：品牌介绍、产品线、服务范围
3. **能力边界**：明确6大服务能力（产品咨询、订单查询、退换货、售后、故障排查、促销）
4. **服务原则**：专业准确、热情友好、耐心细致、适当销售、情绪安抚
5. **边界处理**：非业务问题、无法回答、敏感内容、要求人工客服等场景的引导话术
6. **知识库注入**：检索相关FAQ内容作为参考上下文

## 🗄️ 知识库分类

| 分类 | 条目数 | 内容 |
|------|--------|------|
| 产品咨询 | 6条 | 手机、笔记本、穿戴设备对比与推荐 |
| 价格促销 | 4条 | 优惠活动、分期、以旧换新、团购 |
| 订单物流 | 5条 | 配送时效、物流查询、地址修改 |
| 退换货 | 5条 | 退货条件、流程、运费、退款 |
| 售后保修 | 5条 | 保修期、凭证、网点、碎屏、进水 |
| 使用指导 | 4条 | 数据迁移、手表连接、电脑优化、电池保养 |
| 账号会员 | 3条 | 注册、积分、找回密码 |

## 📝 项目报告

项目报告需按课程要求撰写，建议包含以下章节：

1. 项目背景与市场分析
2. 系统架构设计（含架构图）
3. AI模型集成与优化（提示词工程设计思路与调优）
4. 系统实现（关键技术细节与挑战）
5. 系统测试与部署
6. 项目总结与展望

## ⚠️ 注意事项

- 未配置DeepSeek API Key时，系统使用内置模拟回复，可正常演示前端交互
- 生产环境部署时请修改CORS配置，限制允许的域名
- SQLite适合开发和演示，高并发场景建议迁移至PostgreSQL
