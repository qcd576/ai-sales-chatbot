import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// 全局错误捕获 - 确保APP不会白屏
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
  const root = document.getElementById('root');
  if (root && !root.innerHTML.trim()) {
    root.innerHTML = '<div style="padding:20px;text-align:center;font-family:sans-serif;"><h2>加载失败</h2><p>请重启APP或联系开发者</p><pre style="font-size:12px;color:#999;">' + (e.error?.message || 'Unknown error') + '</pre></div>';
  }
});

const rootEl = document.getElementById('root');
if (rootEl) {
  try {
    ReactDOM.createRoot(rootEl).render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>,
    );
  } catch (err: any) {
    rootEl.innerHTML = '<div style="padding:40px;text-align:center;font-family:sans-serif;"><h1 style="color:#2563eb;">智选AI客服</h1><p style="color:red;">启动失败: ' + (err?.message || '') + '</p></div>';
  }
}
