// ============ 消息 ============
export interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

// ============ 会话 ============
export interface Session {
  session_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

// ============ 聊天 ============
export interface ChatRequest {
  session_id?: string;
  message: string;
}

export interface ChatResponse {
  session_id: string;
  message: string;
  role: 'assistant';
}

// ============ 知识库 ============
export interface KnowledgeItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  created_at: string;
}

export interface KnowledgeCreate {
  question: string;
  answer: string;
  category: string;
}

export interface KnowledgeUpdate {
  question?: string;
  answer?: string;
  category?: string;
}
