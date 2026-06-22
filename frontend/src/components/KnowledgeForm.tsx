import { useState, useEffect } from 'react'
import type { KnowledgeItem, KnowledgeCreate } from '../types'

interface Props {
  editingItem: KnowledgeItem | null
  onSave: (data: KnowledgeCreate) => void
  onCancel: () => void
  saving: boolean
}

const CATEGORIES = [
  '产品咨询',
  '价格促销',
  '订单物流',
  '退换货',
  '售后保修',
  '使用指导',
  '账号会员',
]

export default function KnowledgeForm({ editingItem, onSave, onCancel, saving }: Props) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [category, setCategory] = useState('产品咨询')
  const [customCategory, setCustomCategory] = useState('')

  useEffect(() => {
    if (editingItem) {
      setQuestion(editingItem.question)
      setAnswer(editingItem.answer)
      // 检查是否属于预设分类
      if (CATEGORIES.includes(editingItem.category)) {
        setCategory(editingItem.category)
        setCustomCategory('')
      } else {
        setCategory('__custom__')
        setCustomCategory(editingItem.category)
      }
    } else {
      setQuestion('')
      setAnswer('')
      setCategory('产品咨询')
      setCustomCategory('')
    }
  }, [editingItem])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const finalCategory = category === '__custom__' ? customCategory.trim() : category
    if (!question.trim() || !answer.trim() || !finalCategory) return
    onSave({ question: question.trim(), answer: answer.trim(), category: finalCategory })
  }

  const finalCategory = category === '__custom__' ? customCategory.trim() : category
  const isValid = question.trim() && answer.trim() && finalCategory.length > 0

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {editingItem ? '编辑知识条目' : '新增知识条目'}
      </h3>

      {/* 分类 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => { setCategory(cat); setCustomCategory('') }}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                category === cat
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setCategory('__custom__')}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              category === '__custom__'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            + 自定义
          </button>
        </div>
        {category === '__custom__' && (
          <input
            type="text"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            placeholder="输入自定义分类名"
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                       focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        )}
      </div>

      {/* 问题 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">问题</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="例如：Smart X1多少钱？"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                     focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
        />
      </div>

      {/* 回答 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">回答</label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="输入AI可以参考的标准回答..."
          rows={5}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-y
                     focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
        />
      </div>

      {/* 按钮 */}
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={!isValid || saving}
          className="px-6 py-2 rounded-lg bg-primary-500 text-white text-sm font-medium
                     hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed
                     transition-colors"
        >
          {saving ? '保存中...' : editingItem ? '更新' : '添加'}
        </button>
      </div>
    </form>
  )
}
