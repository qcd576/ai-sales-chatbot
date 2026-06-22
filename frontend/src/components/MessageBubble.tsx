import type { Message } from '../types'

interface Props {
  message: Message
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user'

  return (
    <div className={`message-enter flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {/* AI头像 */}
      {!isUser && (
        <div className="flex-shrink-0 mr-3">
          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-bold">
            智
          </div>
        </div>
      )}

      {/* 消息气泡 */}
      <div
        className={`
          max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed
          ${isUser
            ? 'bg-primary-500 text-white rounded-br-md'
            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm'
          }
        `}
      >
        {/* 消息内容 - 支持简单Markdown */}
        <div
          className="whitespace-pre-wrap break-words"
          dangerouslySetInnerHTML={{
            __html: formatContent(message.content),
          }}
        />
        {/* 时间 */}
        <div
          className={`text-xs mt-1 ${
            isUser ? 'text-primary-100' : 'text-gray-400'
          }`}
        >
          {formatTime(message.created_at)}
        </div>
      </div>

      {/* 用户头像 */}
      {isUser && (
        <div className="flex-shrink-0 ml-3">
          <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-sm font-bold">
            我
          </div>
        </div>
      )}
    </div>
  )
}

/** 简单格式化：加粗、列表 */
function formatContent(text: string): string {
  return text
    // 加粗
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    // 换行
    .replace(/\n/g, '<br/>')
}

function formatTime(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)

  if (diffMin < 1) return '刚刚'
  if (diffMin < 60) return `${diffMin}分钟前`
  if (diffMin < 1440) return `${Math.floor(diffMin / 60)}小时前`
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}
