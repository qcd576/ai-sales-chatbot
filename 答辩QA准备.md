# 答辩准备文档

---

## 一、老师现场5问（必考——图片中的问题）

### Q1: 是用MySQL做的吗？看看数据库

**答**：不是MySQL，用的是 **SQLite 3**。

**为什么选SQLite而不是MySQL？**

1. **零配置、零依赖**：SQLite是嵌入式数据库引擎，不需要独立安装数据库服务（MySQL需要单独安装和配置服务进程）。课程项目单机部署场景下，SQLite更轻量
2. **通过SQLAlchemy ORM操作**：上层代码面向对象操作，底层数据库引擎完全可替换。如果将来需要升级到MySQL或PostgreSQL，只需修改连接URL一行配置，业务代码无需任何改动
3. **项目规模匹配**：课程项目并发量低，SQLite完全满足。SQLite单文件存储（44KB），备份迁移极其方便
4. **完整SQL支持**：SQLite支持标准SQL语法和ACID事务，功能和MySQL在项目规模下无差异

**展示数据库**：

打开项目 → `backend/data/chatbot.db`，用SQLite浏览器或命令行查看：

```sql
-- 3张核心表
.tables
-- conversations: 会话表
-- messages: 消息表
-- knowledge_base: 知识库表(32条)

-- 查看知识库数据
SELECT category, COUNT(*) FROM knowledge_base GROUP BY category;
-- 产品咨询(6) | 价格促销(4) | 订单物流(5) | 退换货(5) | 售后保修(5) | 使用指导(4) | 账号会员(3)

-- 查看实际对话记录
SELECT role, content, created_at FROM messages ORDER BY created_at DESC LIMIT 10;
```

> 可以现场用 `sqlite3 chatbot.db` 打开演示

---

### Q2: 看看程序前端和后端

**前端展示**：
- 打开 `http://120.27.247.44:8000` → 展示聊天界面
- 打开 `/admin` → 展示知识库管理后台（增删改查、分类筛选）
- 打开 `/docs` → 展示Swagger API交互文档（10个端点可直接测试）

**后端代码展示**：
- 打开GitHub仓库或本地IDE，展示核心文件：

| 文件 | 作用 | 亮点 |
|------|------|------|
| `backend/app/main.py` | FastAPI入口 | SPA静态托管+CORS+路由注册 |
| `backend/app/services/llm_service.py` | AI核心 | 六层系统提示词+DeepSeek调用+离线降级 |
| `backend/app/services/knowledge_service.py` | RAG检索 | 关键词匹配评分算法 |
| `backend/app/routes/chat.py` | 聊天API | 会话创建+历史管理+知识库注入 |
| `frontend/src/pages/ChatPage.tsx` | 聊天页面 | 内联样式+离线引擎+多轮对话 |
| `frontend/src/services/api.ts` | API封装 | 自动降级+20+关键词匹配 |

---

### Q2-B: 展示如何打开前端和后端（本地运行演示）

老师可能会让你**现场打开IDE，启动前后端项目**。以下是两种演示方式：

---

#### 方式一：在IDE中展示（VS Code 推荐）

**1. 打开项目**
```
用 VS Code 打开文件夹：C:\Users\qcd\Desktop\新建文件夹\ai-sales-chatbot
```

**2. 启动后端（终端1）**
```bash
cd backend
pip install -r requirements.txt    # 已安装可跳过
python run.py
```
屏幕显示：
```
INFO:     Started server process
INFO:     Uvicorn running on http://127.0.0.1:8000
```
然后浏览器打开 `http://localhost:8000/docs` → 展示Swagger交互文档

**3. 启动前端（终端2，另开一个终端）**
```bash
cd frontend
npm install        # 已安装可跳过
npm run dev
```
屏幕显示：
```
VITE v6.4.3  ready in XXXms
Local:   http://localhost:5173/
```
然后浏览器打开 `http://localhost:5173` → 展示聊天界面

**4. 前后端联调演示**：
- 前端输入消息 → 发送到后端 `localhost:8000/api/chat/send`
- 后端调用DeepSeek API → 返回AI回复 → 前端显示

---

#### 方式二：用命令行直接演示（最简洁）

如果现场不方便开IDE，直接在终端展示：

**后端**：
```bash
# 终端1
cd C:\Users\qcd\Desktop\新建文件夹\ai-sales-chatbot\backend
python run.py
# 看到 Uvicorn running on http://127.0.0.1:8000 说明启动成功
```

**前端**：
```bash
# 终端2
cd C:\Users\qcd\Desktop\新建文件夹\ai-sales-chatbot\frontend
npm run dev
# 看到 Local: http://localhost:5173/ 说明启动成功
```

> 💡 如果老师问 `npm run dev` 和 `npm run build` 的区别：
> - `npm run dev`：开发模式，支持热更新，修改代码自动刷新
> - `npm run build`：生产构建，输出到 `dist/` 文件夹，用于部署

---

#### 演示时建议的讲解话术

> "后端用 `python run.py` 一行命令启动，实际上它执行的是 `uvicorn backend.app.main:app`，FastAPI会自动加载路由、初始化数据库。前端用 `npm run dev` 启动Vite开发服务器，它配置了代理规则，所有 `/api` 请求会自动转发到后端的8000端口。前后端分离开发，通过HTTP/JSON通信，两个终端各自启动即可联调。"

---

### Q3: 演示一下

**在线演示**（推荐，因为可以展示DeepSeek真实AI回复）：
1. 浏览器打开 `http://120.27.247.44:8000`
2. 点击快捷问题或输入测试：
   - "Smart X1多少钱？" → 产品咨询
   - "退货有什么条件？" → 政策解答
   - "我手机开不了机了" → 故障排查+情绪安抚
   - "给我讲个笑话" → 边界处理（礼貌引导）
3. 访问 `/docs` 在线测试API
4. 访问 `/admin` 展示知识库管理

**离线演示**（网络不好时备用）：
- 手机打开APK → 断网 → 输入问题 → 内置引擎回复
- 证明不依赖后端也能工作

**APK演示**：
- 手机浏览器打开 `http://120.27.247.44:8000/smartpick-app.apk`
- 下载安装 → 打开即用（跳过设置页直接进入聊天）

---

### Q4: 看源码

**GitHub仓库**: `https://github.com/qcd576/ai-sales-chatbot`

**项目结构现场讲解**：
```
ai-sales-chatbot/
├── frontend/src/
│   ├── pages/
│   │   ├── ChatPage.tsx      — 主聊天界面（内联样式,支持在线/离线）
│   │   ├── SetupPage.tsx     — 服务器连接设置
│   │   └── AdminPage.tsx     — 知识库管理后台
│   ├── components/
│   │   └── KnowledgeForm.tsx — 知识条目编辑表单
│   ├── services/
│   │   └── api.ts            — API封装+20+关键词离线降级
│   └── types/index.ts        — TypeScript类型定义
├── backend/app/
│   ├── main.py               — FastAPI入口+SPA静态托管+10个API路由
│   ├── models.py             — SQLAlchemy数据模型(3张表)
│   ├── schemas.py            — Pydantic请求/响应校验
│   ├── routes/
│   │   ├── chat.py           — POST /api/chat/send(发送消息+AI回复)
│   │   ├── session.py        — 会话CRUD(创建/列表/消息/删除)
│   │   └── knowledge.py      — 知识库CRUD(增删改查+分类+搜索)
│   └── services/
│       ├── llm_service.py    — DeepSeek API+六层提示词+离线降级
│       └── knowledge_service.py — 关键词评分检索+RAG上下文构建
└── backend/data/
    ├── seed_knowledge.py     — 32条知识库种子数据
    └── chatbot.db            — SQLite数据库文件
```

**关键代码片段展示**：

六层提示词框架（`llm_service.py` 第14-45行）——展示SYSTEM_PROMPT变量
关键词匹配检索（`knowledge_service.py` 第9-67行）——展示search_knowledge函数
离线降级机制（`api.ts` 第7-47行）——展示MOCK_RESPONSES和getMockResponse函数

---

### Q5: 你负责了哪些部分？

我负责了：项目整体架构设计、AI核心实现（六层提示词工程+知识库构建+RAG检索增强）、后端10个API开发、阿里云ECS部署、Android APK打包。

具体来说：
- **提示词工程**: 设计六层框架 → 3轮迭代测试 → 每层精确控制模型行为
- **知识库**: 调研智选科技产品 → 编写7大类32条Q&A → 开发检索评分算法
- **后端**: FastAPI异步框架 → 聊天/会话/知识库三大模块 → Swagger自动文档
- **部署**: SSH连接服务器 → 环境配置 → uvicorn启动 → 防火墙配置 → APK打包

---

## 二、其他常见追问

### Q6: 项目和直接调用大模型API有什么区别？

这是核心创新点。三层增强：

1. **六层提示词工程**：不是写一句话，而是分层精确控制——角色→品牌→能力→原则→边界→知识
2. **RAG检索增强**：32条知识库 → 关键词评分 → Top-3注入 → 回复基于真实数据，价格/政策100%准确
3. **离线降级**：API不可用→自动切换内置引擎(20+关键词)，用户无感知

---

### Q7: 遇到的最大困难是什么？

提示词工程的迭代调优。最初模型回复要么太啰嗦、要么非业务问题乱答、要么销售意图太强。

经过3轮实战测试：分析问题回复 → 定位失效层级 → 调整提示词 → 重新测试。比如边界处理从"不要回答"改为"道歉+解释+引导"，用户体验显著提升。

工程上还解决了：Windows GBK编码错误、Android中文路径报错、Gradle国内下载超时（腾讯云镜像）、阿里云双重防火墙（UFW+安全组）。

---

### Q8: 学到了什么？

1. **大模型应用不只是调API**：提示词工程和RAG才是落地关键
2. **全栈能力**：React → FastAPI → SQLite → 云服务器，完整链路
3. **工程化思维**：错误处理、降级机制、配置管理、版本控制
4. **踩坑经验**：编码/网络/防火墙——真实开发中大部分时间在解决问题

---

## 三、演示速查卡

| 演示项 | 地址/操作 |
|--------|----------|
| 🌐 Web应用 | `http://120.27.247.44:8000` |
| 📋 API文档 | `http://120.27.247.44:8000/docs` |
| ⚙️ 管理后台 | `http://120.27.247.44:8000/admin` |
| 📱 APK下载 | `http://120.27.247.44:8000/smartpick-app.apk` |
| 💻 GitHub | `https://github.com/qcd576/ai-sales-chatbot` |
| 🗄️ 数据库位置 | `backend/data/chatbot.db` (SQLite, 44KB) |
| 🤖 AI模型 | DeepSeek Chat API (deepseek-chat) |
| 📚 知识库 | 7分类 × 32条Q&A |

## 四、演示时必说的几句话

1. "这不是简单调用API——核心在六层提示词框架和RAG检索增强"
2. "SQLite通过SQLAlchemy ORM操作，换MySQL只需改一行配置"
3. "即使后端挂了，系统会自动降级到离线引擎，用户无感知"
4. "部署在阿里云ECS，公网可直接访问，也打包了Android APK"
5. "完整源码在GitHub开源，前端/后端/数据库代码全部可查"
