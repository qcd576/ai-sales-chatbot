import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { testConnection, setBaseUrl, setUseBackend } from '../services/api'

export default function SetupPage() {
  const navigate = useNavigate()
  const [url, setUrl] = useState('http://120.27.247.44:8000/api')
  const [testing, setTesting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'fail'>('idle')

  const handleTest = async () => {
    if (!url.trim()) return
    setTesting(true)
    setStatus('idle')
    const ok = await testConnection(url.trim())
    setTesting(false)
    setStatus(ok ? 'success' : 'fail')
  }

  const handleSaveAndConnect = () => {
    setBaseUrl(url.trim())
    setUseBackend(true)
    localStorage.setItem('app_ready', 'true')
    navigate('/chat', { replace: true })
  }

  const handleOffline = () => {
    setUseBackend(false)
    localStorage.setItem('app_ready', 'true')
    navigate('/chat', { replace: true })
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#f0f2f5',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
      fontFamily: 'system-ui, -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif',
    }}>
      <div style={{
        width: '100%', maxWidth: '360px', background: 'white',
        borderRadius: '16px', padding: '28px 22px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            background: '#2563eb', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 10px', fontSize: '24px', fontWeight: 'bold',
          }}>智</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a2e' }}>
            智选AI客服
          </div>
        </div>

        {/* 离线模式按钮 */}
        <button
          onClick={handleOffline}
          style={{
            width: '100%', padding: '14px', borderRadius: '12px',
            fontSize: '16px', fontWeight: 600, border: 'none',
            background: '#2563eb', color: 'white', cursor: 'pointer',
            marginBottom: '20px',
          }}
        >
          直接开始使用（离线模式）
        </button>

        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          marginBottom: '14px', color: '#999',
        }}>
          <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
          <span style={{ fontSize: '12px' }}>或连接后端服务器</span>
          <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
        </div>

        {/* 服务器地址 */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '13px', fontWeight: 500, color: '#333', marginBottom: '6px' }}>
            服务器地址
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setStatus('idle') }}
            style={{
              width: '100%', padding: '10px 12px', fontSize: '13px',
              border: '1px solid #d1d5db', borderRadius: '10px',
              outline: 'none', boxSizing: 'border-box',
              background: '#f9fafb', color: '#111',
            }}
          />
        </div>

        {status !== 'idle' && (
          <div style={{
            marginBottom: '12px', padding: '10px 12px', borderRadius: '10px',
            fontSize: '13px',
            background: status === 'success' ? '#f0fdf4' : '#fef2f2',
            color: status === 'success' ? '#166534' : '#991b1b',
            border: `1px solid ${status === 'success' ? '#bbf7d0' : '#fecaca'}`,
          }}>
            {status === 'success' ? '连接成功！' : '无法连接，请检查网络'}
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleTest}
            disabled={!url.trim() || testing}
            style={{
              flex: 1, padding: '10px', borderRadius: '10px',
              fontSize: '13px', fontWeight: 500,
              border: '1px solid #d1d5db', background: 'white',
              color: '#374151', cursor: 'pointer',
              opacity: (!url.trim() || testing) ? 0.5 : 1,
            }}
          >
            {testing ? '测试中...' : '测试连接'}
          </button>
          <button
            onClick={handleSaveAndConnect}
            disabled={status !== 'success'}
            style={{
              flex: 1, padding: '10px', borderRadius: '10px',
              fontSize: '13px', fontWeight: 500,
              border: 'none', background: status === 'success' ? '#16a34a' : '#d1d5db',
              color: 'white', cursor: status === 'success' ? 'pointer' : 'default',
            }}
          >
            连接并进入
          </button>
        </div>

        <div style={{
          marginTop: '14px', padding: '12px',
          background: '#eff6ff', borderRadius: '10px',
          fontSize: '11px', color: '#1e40af', lineHeight: 1.5,
        }}>
          离线模式无需网络连接，内置智能回复引擎，可直接体验AI客服功能。
        </div>
      </div>
    </div>
  )
}
