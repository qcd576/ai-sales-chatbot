import { useEffect, useRef } from 'react'
import type { Message } from '../types'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'

interface Props {
  messages: Message[]
  onSend: (message: string) => void
  loading: boolean
  title?: string
}

export default function ChatWindow({ messages, onSend, loading, title }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  // 自动滚动到底部
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  return (
    <div className="flex flex-col h-full">
      {/* 顶部标题栏 */}
      <header className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
            智
          </div>
          <div>
            <h1 className="text-base font-semibold text-gray-900">
              {title || '智选科技 AI客服'}
            </h1>
            <p className="text-xs text-gray-500">在线 · 随时为您服务</p>
          </div>
        </div>
      </header>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto scrollbar-thin bg-gray-50 px-4 py-6">
        {messages.length === 0 ? (
          /* 欢迎界面 */
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mb-6">
              <span className="text-4xl">🤖</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              欢迎使用智选科技AI客服
            </h2>
            <p className="text-gray-500 mb-8 max-w-md">
              我是您的专属客服助手小智，可以帮您解答产品咨询、订单查询、退换货政策等问题
            </p>
            {/* 快捷问题 */}
            <div className="grid grid-cols-2 gap-3 max-w-lg">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => onSend(q)}
                  className="text-left px-4 py-3 rounded-xl border border-gray-200 bg-white
                             text-sm text-gray-600 hover:border-primary-300 hover:text-primary-600
                             hover:shadow-sm transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* 消息列表 */
          <div className="max-w-4xl mx-auto">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {/* 加载指示器 */}
            {loading && (
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-bold">
                  智
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md shadow-sm px-4 py-3">
                  <div className="typing-indicator">
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* 输入框 */}
      <ChatInput onSend={onSend} disabled={loading} />
    </div>
  )
}

const QUICK_QUESTIONS = [
  'Smart X1多少钱？',
  '退货有什么条件？',
  '现在有什么优惠？',
  '产品保修多久？',
]
