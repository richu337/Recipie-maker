import { useState } from 'react'

export default function ProgressTracker({ raw, owned, onOwnedChange }) {
  const [editId, setEditId] = useState(null)
  const [editValue, setEditValue] = useState('')

  if (!raw || raw.length === 0) return null

  const startEdit = (id, val) => {
    setEditId(id)
    setEditValue(String(Math.round(val)))
  }

  const saveEdit = (id) => {
    const v = parseFloat(editValue)
    if (!isNaN(v) && v >= 0) {
      onOwnedChange(id, v)
    }
    setEditId(null)
  }

  return (
    <div className="card animate-slide-up">
      <h2 className="text-lg font-semibold text-craft-text mb-4 flex items-center gap-2">
        <span>📊</span>
        Progress Tracker
      </h2>

      <div className="space-y-2">
        {raw
          .sort((a, b) => b.quantity - a.quantity)
          .map((r) => {
            const currentOwned = owned[r.id] || 0
            const progress = r.quantity > 0 ? Math.min(100, (currentOwned / r.quantity) * 100) : 0
            return (
              <div key={r.id} className="rounded-xl bg-craft-bg/40 border border-white/5 p-3 transition-all duration-200 hover:border-white/10">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-craft-text">{r.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-craft-text-muted">Need:</span>
                    <span className="text-sm font-mono font-bold text-craft-gold">{Math.round(r.quantity * 100) / 100}</span>
                  </div>
                </div>

                <div className="progress-bar mb-1.5">
                  <div
                    className={`progress-bar-fill ${progress >= 100 ? 'bg-craft-green' : 'bg-gradient-to-r from-craft-accent to-craft-accent-glow'}`}
                    style={{ width: `${Math.min(100, progress)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-craft-text-muted">
                    {Math.round(progress)}%
                  </span>
                  <div className="flex items-center gap-1.5">
                    {editId === r.id ? (
                      <>
                        <input
                          type="number"
                          min="0"
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          className="input-field w-20 text-center text-sm py-0.5"
                          autoFocus
                          onKeyDown={e => e.key === 'Enter' && saveEdit(r.id)}
                        />
                        <button onClick={() => saveEdit(r.id)} className="text-xs text-craft-green font-medium">Save</button>
                        <button onClick={() => setEditId(null)} className="text-xs text-craft-text-muted">Cancel</button>
                      </>
                    ) : (
                      <>
                        <span className="text-xs text-craft-text-muted font-mono">{Math.round(currentOwned * 100) / 100} / {Math.round(r.quantity * 100) / 100}</span>
                        <button
                          onClick={() => startEdit(r.id, currentOwned)}
                          className="text-xs text-craft-accent hover:text-craft-accent-glow transition-colors font-medium"
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
