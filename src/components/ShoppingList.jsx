import { useState } from 'react'
import { getItemMeta } from '../data/itemMeta.js'

export default function ShoppingList({ raw, owned }) {
  const [checked, setChecked] = useState({})
  const [copied, setCopied] = useState(false)

  if (!raw || raw.length === 0) return null

  const missingItems = raw
    .map(r => ({
      ...r,
      missing: Math.max(0, r.quantity - (owned[r.id] || 0)),
    }))
    .filter(r => r.missing > 0)
    .sort((a, b) => b.missing - a.missing)

  if (missingItems.length === 0) return null

  const toggleCheck = (id) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const copyToClipboard = () => {
    const text = missingItems
      .map(r => `${checked[r.id] ? '☑' : '☐'} ${getItemMeta(r.name).icon} ${r.name} x${Math.round(r.missing * 100) / 100}`)
      .join('\n')
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="card animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-craft-text flex items-center gap-2">
          <span>🛒</span>
          Shopping List
        </h2>
        <button onClick={copyToClipboard} className="btn-ghost text-xs py-1 px-3">
          {copied ? 'Copied!' : 'Copy List'}
        </button>
      </div>

      <div className="space-y-1.5">
        {missingItems.map((r) => (
          <label
            key={r.id}
            className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 cursor-pointer hover:bg-white/[0.03] ${checked[r.id] ? 'opacity-50' : ''}`}
          >
            <div
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${checked[r.id] ? 'bg-craft-accent border-craft-accent' : 'border-white/20 hover:border-craft-accent/50'}`}
              onClick={() => toggleCheck(r.id)}
            >
              {checked[r.id] && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-lg shrink-0">{getItemMeta(r.name).icon}</span>
            <span className={`flex-1 text-sm ${checked[r.id] ? 'line-through text-craft-text-muted' : 'text-craft-text'}`}>
              {r.name}
            </span>
            <span className="text-sm font-mono font-bold text-craft-gold tabular-nums">
              ×{Math.round(r.missing * 100) / 100}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}
