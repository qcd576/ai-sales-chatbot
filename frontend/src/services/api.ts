/**
 * API 请求封装
 * 优先连接后端，失败时自动切换到内置回复模式
 */

// ============ 内置模拟回复（无需后端） ============
const MOCK_RESPONSES: Record<string, string> = {
  '你好': '您好！👋 欢迎来到智选科技！我是您的专属客服助手小智，很高兴为您服务。\n\n我可以帮您：\n1. 📱 了解产品信息与选购建议\n2. 📦 查询订单状态与物流\n3. 🔄 了解退换货政策\n4. 🔧 售后维修与故障排查\n5. 🎫 了解最新优惠活动\n\n请问有什么可以帮您的？',
  'hi': '您好！👋 欢迎来到智选科技！我是您的专属客服助手小智，很高兴为您服务。\n\n请问有什么可以帮您的？',
  'hello': '您好！👋 欢迎来到智选科技！我是您的专属客服助手小智，很高兴为您服务。\n\n请问有什么可以帮您的？',
  '价格': '关于价格和优惠，智选科技目前有以下热门产品：\n\n📱 智能手机系列\n- Smart X1：¥2,999起（性价比之王）\n- Smart X1 Pro：¥4,299起（旗舰性能）\n\n💻 笔记本电脑系列\n- Book Air 14：¥4,999起（轻薄办公）\n- Book Pro 16：¥7,999起（高性能创作）\n\n⌚ 智能穿戴\n- Watch S3：¥899起\n\n🔥 本月活动：满3000减200，学生认证额外9.5折！\n感兴趣哪款产品？我可以为您详细介绍～',
  '退货': '智选科技的退换货政策如下：\n\n📋 退换货条件\n1. 自签收之日起7天内，产品未使用、包装完好可申请无理由退货\n2. 产品存在质量问题，15天内可换货，1年内免费保修\n3. 退货需保留完整包装、配件和发票\n\n📝 退货流程\n1. 在APP/官网提交退货申请\n2. 审核通过后，按指引寄回商品\n3. 仓库验货后，3-5个工作日退款到账\n\n💡 运费规则：质量问题和错发免运费，无理由退货由买家承担\n\n需要我帮您提交退货申请吗？',
  '换货': '智选科技的换货政策：\n\n📋 换货条件：产品存在质量问题，15天内可申请换货。\n\n📝 换货流程：\n1. 提交换货申请并审核通过\n2. 寄回问题商品\n3. 仓库确认后1-2个工作日内发新货\n整体周期约5-7个工作日。\n\n需要我帮您提交换货申请吗？',
  '退款': '退款到账时间：\n- 支付宝/微信支付：3-5个工作日\n- 银行卡/信用卡：5-7个工作日\n- 花呗/白条：3-5个工作日恢复额度\n\n退款从仓库验货通过后开始计算。如超时未收到，请联系客服查询。',
  '故障': '很抱歉您遇到了产品问题！让我帮您排查一下 🔧\n\n常见问题快速排查：\n1. 🔄 尝试重启设备（很多问题可以通过重启解决）\n2. 🔌 检查充电和电源连接是否正常\n3. 🔄 确认系统/固件已更新到最新版本\n4. 📱 尝试恢复出厂设置（注意提前备份数据）\n\n保修政策：\n- 主机保修1年，配件保修6个月\n- 保修期内非人为损坏免费维修\n\n如果以上方法无法解决，我可以帮您：\n- 📍 查询最近的授权维修网点\n- 📞 预约上门取件维修服务\n- 🎫 创建售后服务工单\n\n请告诉我您的产品型号和具体问题！',
  '维修': '关于售后维修：\n\n保修政策：\n- 手机/平板：主机1年，电池6个月，充电器3个月\n- 笔记本：主机2年，电池/适配器1年\n- 手表/手环：主机1年，表带/充电器3个月\n\n全国500+授权维修网点，覆盖所有地级市！\n\n查询网点：APP→服务→售后网点→自动定位最近网点\n或者拨打客服热线400-888-XXXX查询。',
  '保修': '智选科技产品保修期限：\n\n📱 手机/平板：主机1年，电池6个月，充电器/数据线3个月\n💻 笔记本：主机2年，电池/适配器1年\n⌚ 手表/手环：主机1年，表带/充电器3个月\n🎧 耳机：6个月\n\n保修期从购买日起算，凭发票或电子购买记录享受保修。人为损坏不在保修范围内。',
  '发货': '关于订单和物流：📦\n\n配送时效：\n- 一线城市：下单后1-2天送达\n- 二三线城市：2-4天送达\n- 偏远地区：4-7天送达\n\n物流查询方式：\n1. 在智选科技APP「我的订单」中查看实时物流\n2. 凭运单号在各快递官网查询\n\n如果您需要查询具体订单，请提供订单号，我帮您查看～',
  '物流': '关于订单和物流：📦\n\n配送时效：\n- 一线城市：下单后1-2天送达\n- 二三线城市：2-4天送达\n\n默认发顺丰/京东物流。支持全国配送和到店自提。\n部分商品支持同城2小时极速达（限部分城市）。',
  '订单': '关于订单和物流，我可以帮您查询！📦\n\n配送时效：一线城市1-2天，省会及二线城市2-3天，三四线城市3-5天。\n\n如需查询具体订单，请提供订单号，我帮您查看物流状态～',
  '优惠': '🔥 本月促销活动：\n1. 全场满3000元减200元\n2. 学生认证享9.5折（可叠加满减）\n3. 以旧换新最高补贴1000元\n4. 购买手机+手表套餐享9折\n5. 新用户首单立减50元\n\n感兴趣哪个活动？我帮您详细介绍！',
  '分期': '支持分期付款！与花呗、京东白条、信用卡合作，大部分商品支持3/6/12/24期免息分期。\n\n具体：\n- 订单满500元可用花呗分期\n- 满1000元可用白条\n- 满2000元可用信用卡分期',
  '产品': '智选科技主营产品：\n\n📱 智能手机：Smart X1（¥2,999起）/ X1 Pro（¥4,299起）\n💻 笔记本：Book Air 14（¥4,999起）/ Book Pro 16（¥7,999起）\n📋 平板：Pad Max（¥2,499起）\n⌚ 穿戴：Watch S3（¥899起）/ S3 Pro（¥1,299起）/ Band 2（¥199）\n\n请问您对哪款产品感兴趣？我帮您详细介绍！',
  '会员': '会员积分权益：🎁\n\n消费1元=1积分，100积分=1元。\n\n积分可：\n1. 兑换优惠券（1000分换10元券）\n2. 兑换配件（保护壳、贴膜等）\n3. 抵扣运费\n4. 参与积分抽奖\n5. 升级会员等级享更多特权\n\n积分有效期1年，记得及时使用哦！',
};

function getMockResponse(message: string): string {
  const msg = message.toLowerCase();
  const keywords = Object.keys(MOCK_RESPONSES);

  // 精确关键词匹配
  for (const kw of keywords) {
    if (msg.includes(kw)) {
      return MOCK_RESPONSES[kw];
    }
  }

  // 模糊匹配
  if (msg.includes('钱') || msg.includes('多少') || msg.includes('贵')) return MOCK_RESPONSES['价格'];
  if (msg.includes('退') || msg.includes('换')) return MOCK_RESPONSES['退货'];
  if (msg.includes('坏') || msg.includes('不工作') || msg.includes('问题')) return MOCK_RESPONSES['故障'];
  if (msg.includes('修') || msg.includes('保')) return MOCK_RESPONSES['维修'];
  if (msg.includes('寄') || msg.includes('送') || msg.includes('快递')) return MOCK_RESPONSES['物流'];
  if (msg.includes('买') || msg.includes('推荐') || msg.includes('介绍')) return MOCK_RESPONSES['产品'];

  return '感谢您的咨询！我是智选科技AI客服助手小智。\n\n我可以帮您：\n📱 产品咨询与选购建议\n📦 订单查询与物流\n🔄 退换货政策\n🔧 售后维修与故障排查\n🎫 优惠活动\n\n请告诉我您具体想了解什么？😊';
}

// ============ 网络请求（带自动降级） ============
let useBackend = false; // 默认使用内置回复
let baseUrl = '/api';

export function getBaseUrl(): string {
  const saved = localStorage.getItem('api_base_url');
  if (saved) return saved;
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  return '/api';
}

export function setUseBackend(use: boolean) {
  useBackend = use;
}

export function setBaseUrl(url: string) {
  baseUrl = url;
  localStorage.setItem('api_base_url', url);
}

export async function testConnection(url: string): Promise<boolean> {
  // Try root endpoint
  const rootUrl = url.replace(/\/api\/?$/, '');
  try {
    const resp = await fetch(rootUrl + '/', { method: 'GET' });
    if (resp.ok) return true;
  } catch {}
  // Try /api/ endpoint
  try {
    const resp = await fetch(url.replace(/\/$/, '') + '/', { method: 'GET' });
    if (resp.ok) return true;
  } catch {}
  return false;
}

async function backendRequest<T>(url: string, options?: RequestInit): Promise<T> {
  const resp = await fetch(`${baseUrl}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!resp.ok) throw new Error('Request failed');
  return resp.json();
}

// ============ 公开API（自动降级） ============

let sessionCounter = '';

export async function sendMessage(sessionId: string | undefined, message: string) {
  if (useBackend) {
    try {
      const resp = await backendRequest<{ session_id: string; message: string; role: string }>(
        '/chat/send', {
          method: 'POST',
          body: JSON.stringify({ session_id: sessionId || undefined, message }),
        }
      );
      return resp;
    } catch {
      // 降级到内置回复
    }
  }

  // 内置回复
  if (!sessionId) {
    sessionCounter = 'local_' + Date.now().toString(36);
  }
  return {
    session_id: sessionId || sessionCounter,
    message: getMockResponse(message),
    role: 'assistant' as const,
  };
}

export async function getSessions() {
  if (useBackend) {
    try { return await backendRequest<any[]>('/sessions'); } catch {}
  }
  return [];
}

export async function createSession() {
  if (useBackend) {
    try { return await backendRequest<any>('/sessions', { method: 'POST' }); } catch {}
  }
  return { session_id: 'local_' + Date.now().toString(36), title: '新对话', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), message_count: 0 };
}

export async function getMessages(sessionId: string) {
  if (useBackend) {
    try { return await backendRequest<any[]>(`/sessions/${sessionId}/messages`); } catch {}
  }
  return [];
}

export async function deleteSession(sessionId: string) {
  if (useBackend) {
    try { return await backendRequest<any>(`/sessions/${sessionId}`, { method: 'DELETE' }); } catch {}
  }
  return { success: true, message: '已删除' };
}

export async function getKnowledgeList(params?: { category?: string; search?: string }) {
  if (useBackend) {
    try {
      const sp = new URLSearchParams();
      if (params?.category) sp.set('category', params.category);
      if (params?.search) sp.set('search', params.search);
      const qs = sp.toString();
      return await backendRequest<any[]>(`/knowledge${qs ? '?' + qs : ''}`);
    } catch {}
  }
  return [];
}

export async function getCategories() {
  if (useBackend) {
    try { return await backendRequest<string[]>('/knowledge/categories'); } catch {}
  }
  return ['产品咨询', '价格促销', '订单物流', '退换货', '售后保修', '使用指导', '账号会员'];
}

export async function createKnowledge(data: any) {
  if (useBackend) {
    try { return await backendRequest<any>('/knowledge', { method: 'POST', body: JSON.stringify(data) }); } catch {}
  }
  return { id: Date.now(), ...data, created_at: new Date().toISOString() };
}

export async function updateKnowledge(id: number, data: any) {
  if (useBackend) {
    try { return await backendRequest<any>(`/knowledge/${id}`, { method: 'PUT', body: JSON.stringify(data) }); } catch {}
  }
  return { id, ...data, created_at: new Date().toISOString() };
}

export async function deleteKnowledge(id: number) {
  if (useBackend) {
    try { return await backendRequest<any>(`/knowledge/${id}`, { method: 'DELETE' }); } catch {}
  }
  return { success: true };
}
