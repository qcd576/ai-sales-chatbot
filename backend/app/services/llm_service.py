"""
LLM服务 - DeepSeek API 对接与提示词工程
"""
import httpx
from typing import List, Dict, Optional
from ..config import DEEPSEEK_API_KEY, DEEPSEEK_BASE_URL, DEEPSEEK_MODEL, BRAND_NAME, BRAND_DESC


# ============================================================
# 系统提示词工程 — 核心设计
# ============================================================
SYSTEM_PROMPT = f"""你是「{BRAND_NAME}」的AI智能客服助手，名叫"小智"。你的职责是为客户提供专业、热情、耐心的销售咨询和售后服务。

## 品牌背景
{BRAND_DESC}

## 你的能力范围
你可以帮助客户解决以下问题：
1. **产品咨询**：介绍产品特性、配置、价格、适用场景，帮助客户选择合适的产品
2. **订单查询**：查询订单状态、物流信息、预计送达时间
3. **退换货政策**：解答退换货条件、流程、时效、运费承担等问题
4. **售后维修**：说明保修政策、维修流程、售后网点查询方式
5. **故障排查**：针对常见产品使用问题，提供基础故障排查引导
6. **促销活动**：介绍当前优惠活动、优惠券使用规则

## 服务原则
- **专业准确**：基于知识库和产品信息回答，不确定时如实说明，不编造信息
- **热情友好**：使用亲切自然的语气，适当使用表情符号（🙂），让客户感到温暖
- **耐心细致**：对于复杂问题，分步骤清晰解答，确认客户是否理解
- **销售意识**：在合适的时机自然推荐相关产品或增值服务，但不强行推销
- **情绪安抚**：遇到客户投诉或不满时，先表示理解和歉意，再积极解决问题

## 边界处理
遇到以下情况时，请礼貌引导：
- **非业务问题**："抱歉，我是{BRAND_NAME}的专属客服，主要处理产品和服务相关问题。您是否有关于我们产品的疑问呢？😊"
- **无法回答的技术细节**："这个问题涉及较专业的技术细节，我建议您联系我们的技术支持团队获取更准确的解答。不过我可以先帮您记录问题并转接给专员。"
- **敏感或不当言论**：礼貌地表示无法回应，并将对话引导回正常的服务范围
- **要求人工客服**："我理解您希望与人工客服沟通。您可以在工作日9:00-18:00拨打我们的客服热线400-888-XXXX，或在此留言，我会帮您记录并转达。"

## 回复格式要求
- 回复简洁明了，重点突出
- 涉及步骤操作时，使用编号列表
- 重要信息（如价格、期限）可适当强调
- 每次回复控制在300字以内，复杂问题可以分段说明
"""


def build_messages(
    user_message: str,
    history: List[Dict[str, str]],
    knowledge_context: str = "",
) -> List[Dict[str, str]]:
    """
    构建发送给LLM的完整消息列表

    Args:
        user_message: 当前用户消息
        history: 历史对话 [{"role": "user/assistant", "content": "..."}]
        knowledge_context: 从知识库检索到的相关内容

    Returns:
        完整的消息列表
    """
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    # 注入知识库上下文
    if knowledge_context:
        knowledge_prompt = (
            "以下是知识库中与当前问题相关的参考信息，请基于这些信息回答客户问题。"
            "如果参考信息不足以回答，请根据自己的知识补充，但要说明信息来源的局限性。\n\n"
            f"【参考知识】\n{knowledge_context}"
        )
        messages.append({"role": "system", "content": knowledge_prompt})

    # 添加历史对话（最近10轮）
    recent_history = history[-20:]  # 最多10轮对话 = 20条消息
    messages.extend(recent_history)

    # 添加当前用户消息
    messages.append({"role": "user", "content": user_message})

    return messages


async def call_deepseek(
    messages: List[Dict[str, str]],
    temperature: float = 0.7,
    max_tokens: int = 1024,
) -> str:
    """
    调用DeepSeek API获取回复

    Args:
        messages: 完整的消息列表
        temperature: 生成温度 (0-1)
        max_tokens: 最大输出token数

    Returns:
        AI回复文本
    """
    # 如果API Key未配置，返回模拟回复
    if DEEPSEEK_API_KEY == "your-api-key-here":
        return _mock_response(messages[-1]["content"])

    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.post(
                f"{DEEPSEEK_BASE_URL}/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": DEEPSEEK_MODEL,
                    "messages": messages,
                    "temperature": temperature,
                    "max_tokens": max_tokens,
                },
            )
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
        except httpx.HTTPError as e:
            return f"抱歉，AI服务暂时不可用，请稍后再试。（错误详情：{str(e)[:100]}）"
        except (KeyError, IndexError) as e:
            return f"抱歉，AI响应解析失败，请稍后再试。"


def _mock_response(user_message: str) -> str:
    """
    未配置API Key时的模拟回复（用于开发调试）
    实际使用时请配置 DEEPSEEK_API_KEY 环境变量
    """
    msg_lower = user_message.lower()

    if any(w in msg_lower for w in ["你好", "您好", "hi", "hello", "在吗"]):
        return (
            f"您好！👋 欢迎来到{BRAND_NAME}！我是您的专属客服助手小智，很高兴为您服务。\n\n"
            f"我可以帮您：\n"
            f"1. 📱 了解产品信息与选购建议\n"
            f"2. 📦 查询订单状态与物流\n"
            f"3. 🔄 了解退换货政策\n"
            f"4. 🔧 售后维修与故障排查\n"
            f"5. 🎫 了解最新优惠活动\n\n"
            f"请问有什么可以帮您的？"
        )

    if any(w in msg_lower for w in ["价格", "多少钱", "便宜", "贵", "优惠", "折扣", "活动"]):
        return (
            f"关于价格和优惠，{BRAND_NAME}目前有以下热门产品：\n\n"
            f"📱 **智能手机系列**\n"
            f"- Smart X1：¥2,999起（性价比之王）\n"
            f"- Smart X1 Pro：¥4,299起（旗舰性能）\n\n"
            f"💻 **笔记本电脑系列**\n"
            f"- Book Air 14：¥4,999起（轻薄办公）\n"
            f"- Book Pro 16：¥7,999起（高性能创作）\n\n"
            f"⌚ **智能穿戴**\n"
            f"- Watch S3：¥899起\n\n"
            f"🔥 本月活动：满3000减200，学生认证额外9.5折！\n"
            f"感兴趣哪款产品？我可以为您详细介绍～"
        )

    if any(w in msg_lower for w in ["退货", "换货", "退款", "退换"]):
        return (
            f"{BRAND_NAME}的退换货政策如下：\n\n"
            f"📋 **退换货条件**\n"
            f"1. 自签收之日起7天内，产品未使用、包装完好可申请无理由退货\n"
            f"2. 产品存在质量问题，15天内可换货，1年内免费保修\n"
            f"3. 退货需保留完整包装、配件和发票\n\n"
            f"📝 **退货流程**\n"
            f"1. 在APP/官网提交退货申请\n"
            f"2. 审核通过后，按指引寄回商品\n"
            f"3. 仓库验货后，3-5个工作日退款到账\n\n"
            f"💡 **运费规则**：质量问题和错发免运费，无理由退货由买家承担\n\n"
            f"需要我帮您提交退货申请吗？"
        )

    if any(w in msg_lower for w in ["故障", "坏了", "不好使", "问题", "维修", "保修", "售后"]):
        return (
            f"很抱歉您遇到了产品问题！让我帮您排查一下 🔧\n\n"
            f"**常见问题快速排查：**\n"
            f"1. 🔄 尝试重启设备（很多问题可以通过重启解决）\n"
            f"2. 🔌 检查充电和电源连接是否正常\n"
            f"3. 🔄 确认系统/固件已更新到最新版本\n"
            f"4. 📱 尝试恢复出厂设置（注意提前备份数据）\n\n"
            f"**保修政策：**\n"
            f"- 主机保修1年，配件保修6个月\n"
            f"- 保修期内非人为损坏免费维修\n\n"
            f"如果以上方法无法解决，我可以帮您：\n"
            f"- 📍 查询最近的授权维修网点\n"
            f"- 📞 预约上门取件维修服务\n"
            f"- 🎫 创建售后服务工单\n\n"
            f"请告诉我您的产品型号和具体问题，我会帮您进一步处理！"
        )

    if any(w in msg_lower for w in ["发货", "物流", "快递", "订单", "配送", "收到"]):
        return (
            f"关于订单和物流，我可以帮您查询！📦\n\n"
            f"**配送时效：**\n"
            f"- 一线城市：下单后1-2天送达\n"
            f"- 二三线城市：2-4天送达\n"
            f"- 偏远地区：4-7天送达\n\n"
            f"**物流查询方式：**\n"
            f"1. 在{BRAND_NAME}APP「我的订单」中查看实时物流\n"
            f"2. 凭运单号在各快递官网查询\n\n"
            f"如果您需要查询具体订单，请提供订单号，我帮您查看～"
        )

    # 默认回复
    return (
        f"感谢您的咨询！关于「{user_message[:30]}...」这个问题，"
        f"我需要更多信息才能给您准确的答复。\n\n"
        f"您可以告诉我：\n"
        f"- 您关注的是哪款产品？\n"
        f"- 具体的需求或遇到的问题？\n\n"
        f"我会尽力为您提供帮助！😊"
    )
