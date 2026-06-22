import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import KnowledgeForm from '../components/KnowledgeForm'
import * as api from '../services/api'
import type { KnowledgeItem, KnowledgeCreate } from '../types'

export default function AdminPage() {
  const [items, setItems] = useState<KnowledgeItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [editingItem, setEditingItem] = useState<KnowledgeItem | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  // 加载数据
  const loadData = useCallback(async () => {
    try {
      const [itemsData, catsData] = await Promise.all([
        api.getKnowledgeList({
          category: filterCategory || undefined,
          search: search || undefined,
        }),
        api.getCategories(),
      ])
      setItems(itemsData)
      setCategories(catsData)
    } catch {
      // 忽略
    } finally {
      setLoading(false)
    }
  }, [search, filterCategory])

  useEffect(() => {
    loadData()
  }, [loadData])

  // 保存（新增或更新）
  const handleSave = async (data: KnowledgeCreate) => {
    setSaving(true)
    try {
      if (editingItem) {
        await api.updateKnowledge(editingItem.id, data)
      } else {
        await api.createKnowledge(data)
      }
      setShowForm(false)
      setEditingItem(null)
      loadData()
    } catch {
      alert('保存失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  // 删除
  const handleDelete = async (id: number) => {
    if (deletingId === id) {
      try {
        await api.deleteKnowledge(id)
        loadData()
      } catch {
        alert('删除失败')
      } finally {
        setDeletingId(null)
      }
    } else {
      setDeletingId(id)
      setTimeout(() => setDeletingId(null), 3000)
    }
  }

  // 编辑
  const handleEdit = (item: KnowledgeItem) => {
    setEditingItem(item)
    setShowForm(true)
  }

  // 取消编辑
  const handleCancel = () => {
    setShowForm(false)
    setEditingItem(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="返回聊天"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-gray-800">知识库管理</h1>
            <span className="text-sm text-gray-400">{items.length} 条</span>
          </div>
          <button
            onClick={() => { setEditingItem(null); setShowForm(true) }}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium
                       hover:bg-primary-600 transition-colors"
          >
            + 新增条目
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* 搜索和筛选 */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索知识库..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm
                       focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white
                       focus:outline-none focus:border-primary-400"
          >
            <option value="">全部分类</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* 编辑表单 */}
        {showForm && (
          <div className="mb-6">
            <KnowledgeForm
              editingItem={editingItem}
              onSave={handleSave}
              onCancel={handleCancel}
              saving={saving}
            />
          </div>
        )}

        {/* 知识库列表 */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">加载中...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            暂无数据
            {search && '，请调整搜索条件'}
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 font-medium">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 mb-1">
                      Q: {item.question}
                    </p>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      A: {item.answer}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-3 py-1.5 text-xs text-gray-500 hover:text-primary-600
                                 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                        deletingId === item.id
                          ? 'text-red-600 bg-red-50'
                          : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                      }`}
                    >
                      {deletingId === item.id ? '确认删除?' : '删除'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
