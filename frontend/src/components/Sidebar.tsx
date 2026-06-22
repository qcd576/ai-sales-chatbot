import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Session } from '../types'

interface Props {
  sessions: Session[]
  currentSessionId: string | undefined
  onNewChat: () => void
  onDeleteSession: (sessionId: string) => void
  collapsed: boolean
  onToggleCollapse: () => void
}

export default function Sidebar({
  sessions,
  currentSessionId,
  onNewChat,
  onDeleteSession,
  collapsed,
  onToggleCollapse,
}: Props) {
  const navigate = useNavigate()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation()
    if (deletingId === sessionId) {
      onDeleteSession(sessionId)
      setDeletingId(null)
    } else {
      setDeletingId(sessionId)
      setTimeout(() => setDeletingId(null), 3000)
    }
  }

  if (collapsed) {
    return (
      <div className="w-14 bg-gray-900 flex flex-col items-center py-4 gap-4">
        <button
          onClick={onToggleCollapse}
          className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
          title="展开侧边栏"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
        <button
          onClick={onNewChat}
          className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
          title="新对话"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    )
  }

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-full">
      {/* 头部 */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">智选科技</h2>
          <button
            onClick={onToggleCollapse}
            className="text-gray-400 hover:text-white p-1 rounded transition-colors"
            title="收起侧边栏"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* 新建对话按钮 */}
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-600
                     text-sm text-gray-200 hover:bg-gray-800 hover:border-gray-500 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          新建对话
        </button>
      </div>

      {/* 会话列表 */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
        {sessions.length === 0 ? (
          <p className="text-gray-500 text-sm text-center mt-8">暂无对话记录</p>
        ) : (
          sessions.map((session) => (
            <div
              key={session.session_id}
              onClick={() => navigate(`/chat/${session.session_id}`)}
              className={`
                group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer mb-1
                transition-colors text-sm
                ${session.session_id === currentSessionId
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }
              `}
            >
              <svg className="w-4 h-4 flex-shrink-0 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>

              <span className="flex-1 truncate">{session.title}</span>

              {/* 删除按钮 */}
              <button
                onClick={(e) => handleDelete(e, session.session_id)}
                className={`
                  flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity
                  p-1 rounded hover:bg-gray-600
                  ${deletingId === session.session_id ? 'opacity-100 text-red-400' : 'text-gray-400'}
                `}
                title={deletingId === session.session_id ? '确认删除' : '删除会话'}
              >
                {deletingId === session.session_id ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
              </button>
            </div>
          ))
        )}
      </div>

      {/* 底部链接 */}
      <div className="p-3 border-t border-gray-700 space-y-1">
        <a
          href="/setup"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400
                     hover:text-white hover:bg-gray-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          服务器设置
        </a>
        <a
          href="/admin"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400
                     hover:text-white hover:bg-gray-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          管理后台
        </a>
      </div>
    </div>
  )
}
