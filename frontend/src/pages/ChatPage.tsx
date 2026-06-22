import { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import * as api from '../services/api'

interface Msg { id: number; role: string; content: string; created_at: string }

// 快捷问题
const QUICK = ['Smart X1多少钱？', '退货有什么条件？', '现在有优惠吗？', '产品保修多久？']

export default function ChatPage() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Msg[]>([])
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState('')
  const [sessionId, setSessionId] = useState<string | undefined>()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  const handleSend = useCallback(async (text: string) => {
    if (loading || !text.trim()) return
    const msg = text.trim()
    setInput('')

    const userMsg: Msg = { id: Date.now(), role: 'user', content: msg, created_at: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const resp = await api.sendMessage(sessionId, msg)
      setSessionId(resp.session_id)
      const aiMsg: Msg = { id: Date.now() + 1, role: 'assistant', content: resp.message, created_at: new Date().toISOString() }
      setMessages(prev => [...prev, aiMsg])
    } catch {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: '抱歉，回复失败，请重试。', created_at: new Date().toISOString() }])
    }
    setLoading(false)
  }, [loading, sessionId])

  const handleNewChat = () => {
    setMessages([])
    setSessionId(undefined)
  }

  const formatTime = (d: string) => {
    if (!d) return ''
    const diff = Date.now() - new Date(d).getTime()
    if (diff < 60000) return '刚刚'
    if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
    return new Date(d).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#f0f2f5', fontFamily: 'system-ui, sans-serif' }}>
      {/* 顶部栏 */}
      <div style={{
        background: '#2563eb', color: 'white', padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: '10px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%', background: 'white',
          color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 'bold', fontSize: '16px',
        }}>智</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: '15px' }}>智选AI客服</div>
          <div style={{ fontSize: '11px', opacity: 0.85 }}>离线模式</div>
        </div>
        <button onClick={handleNewChat} style={{
          background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white',
          padding: '6px 12px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer',
        }}>新对话</button>
      </div>

      {/* 消息列表 */}
      <div style={{ flex: 1, overflow: 'auto', padding: '12px' }}>
        {messages.length === 0 ? (
          /* 欢迎页 */
          <div style={{ textAlign: 'center', paddingTop: '60px' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%', background: '#2563eb',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', fontSize: '28px', fontWeight: 'bold',
            }}>智</div>
            <div style={{ fontSize: '17px', fontWeight: 600, color: '#1a1a2e', marginBottom: '6px' }}>
              欢迎使用智选AI客服
            </div>
            <div style={{ fontSize: '13px', color: '#888', marginBottom: '20px' }}>
              我是小智，可以帮您解答产品、订单、售后等问题
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', padding: '0 20px' }}>
              {QUICK.map(q => (
                <button key={q} onClick={() => handleSend(q)} style={{
                  padding: '10px 14px', borderRadius: '20px', border: '1px solid #d1d5db',
                  background: 'white', fontSize: '13px', color: '#555', cursor: 'pointer',
                }}>{q}</button>
              ))}
            </div>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} style={{
              display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '12px',
            }}>
              {msg.role === 'assistant' && (
                <div style={{
                  width: '30px', height: '30px', borderRadius: '50%', background: '#2563eb',
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: 'bold', marginRight: '8px', flexShrink: 0,
                }}>智</div>
              )}
              <div style={{
                maxWidth: '75%', padding: '10px 14px', borderRadius: '14px',
                background: msg.role === 'user' ? '#2563eb' : 'white',
                color: msg.role === 'user' ? 'white' : '#333',
                fontSize: '14px', lineHeight: 1.5, whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                boxShadow: msg.role === 'assistant' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}>
                <div dangerouslySetInnerHTML={{
                  __html: msg.content.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br/>')
                }} />
                <div style={{
                  fontSize: '10px', marginTop: '4px',
                  color: msg.role === 'user' ? 'rgba(255,255,255,0.7)' : '#aaa',
                }}>{formatTime(msg.created_at)}</div>
              </div>
              {msg.role === 'user' && (
                <div style={{
                  width: '30px', height: '30px', borderRadius: '50%', background: '#9ca3af',
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 'bold', marginLeft: '8px', flexShrink: 0,
                }}>我</div>
              )}
            </div>
          ))
        )}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{
              width: '30px', height: '30px', borderRadius: '50%', background: '#2563eb',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: 'bold',
            }}>智</div>
            <div style={{ padding: '10px 14px', borderRadius: '14px', background: 'white', fontSize: '13px', color: '#999' }}>
              正在输入...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* 输入区 */}
      <div style={{
        background: 'white', padding: '10px 14px', borderTop: '1px solid #e5e7eb',
        display: 'flex', gap: '8px', alignItems: 'flex-end',
      }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(input) } }}
          placeholder="输入您的问题..."
          disabled={loading}
          rows={1}
          style={{
            flex: 1, padding: '10px 12px', borderRadius: '20px',
            border: '1px solid #d1d5db', fontSize: '14px', resize: 'none',
            outline: 'none', background: '#f9fafb', fontFamily: 'inherit',
            maxHeight: '100px',
          }}
        />
        <button
          onClick={() => handleSend(input)}
          disabled={loading || !input.trim()}
          style={{
            width: '40px', height: '40px', borderRadius: '50%', border: 'none',
            background: (loading || !input.trim()) ? '#d1d5db' : '#2563eb',
            color: 'white', fontSize: '18px', cursor: (loading || !input.trim()) ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >↑</button>
      </div>

      {/* 底部导航 */}
      <div style={{
        display: 'flex', borderTop: '1px solid #e5e7eb', background: 'white',
      }}>
        <button onClick={() => navigate('/setup')} style={{
          flex: 1, padding: '10px', border: 'none', background: 'white',
          fontSize: '12px', color: '#666', cursor: 'pointer',
        }}>⚙ 设置</button>
        <button onClick={handleNewChat} style={{
          flex: 1, padding: '10px', border: 'none', background: 'white',
          fontSize: '12px', color: '#666', cursor: 'pointer',
        }}>+ 新对话</button>
      </div>
    </div>
  )
}
