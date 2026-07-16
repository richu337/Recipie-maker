import { useState } from 'react'
import { getItemMeta, getRarityStyle, CATEGORIES } from '../data/itemMeta.js'

export default function ItemManager({ items, onAddItem, onUpdateItem, onDeleteItem, onRefresh }) {
  const [name, setName] = useState('')
  const [craftable, setCraftable] = useState(false)
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editCraftable, setEditCraftable] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState('all')

  async function handleAdd(e) {
    e.preventDefault()
    if (!name.trim()) return
    setAdding(true)
    try {
      await onAddItem(name.trim(), craftable)
      setName('')
      setCraftable(false)
      await onRefresh()
    } finally {
      setAdding(false)
    }
  }

  function startEdit(item) {
    setEditingId(item.id)
    setEditName(item.name)
    setEditCraftable(item.craftable)
  }

  async function handleSave(id) {
    if (!editName.trim()) return
    await onUpdateItem(id, { name: editName.trim(), craftable: editCraftable })
    setEditingId(null)
    await onRefresh()
  }

  async function handleDelete(id) {
    await onDeleteItem(id)
    await onRefresh()
  }

  async function handleCancelEdit() {
    setEditingId(null)
  }

  async function handleToggleCraftable(item) {
    await onUpdateItem(item.id, { craftable: !item.craftable })
    await onRefresh()
  }

  const filteredItems = categoryFilter === 'all'
    ? items
    : items.filter(i => getItemMeta(i.name).category === categoryFilter)

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="card">
        <h2 className="text-lg font-semibold text-craft-text mb-4 flex items-center gap-2">
          <span>➕</span>
          Add New Item
        </h2>
        <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="e.g. Iron Ingot"
              required
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-colors">
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${craftable ? 'bg-craft-accent border-craft-accent' : 'border-white/20'}`}>
              {craftable && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-sm text-craft-text">Craftable</span>
          </label>
          <button type="submit" disabled={adding || !name.trim()} className="btn-primary whitespace-nowrap">
            {adding ? 'Adding...' : 'Add Item'}
          </button>
        </form>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-lg font-semibold text-craft-text m-0">
            All Items ({items.length})
          </h2>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {CATEGORIES.slice(0, 6).map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id === categoryFilter ? 'all' : cat.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  categoryFilter === cat.id
                    ? 'bg-craft-accent/10 text-craft-accent border border-craft-accent/20'
                    : 'text-craft-text-muted hover:text-craft-text hover:bg-white/5 border border-transparent'
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {filteredItems.length === 0 && (
          <p className="text-craft-text-muted/50 text-sm text-center py-4">No items in this category.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {filteredItems.map((item) => {
            const meta = getItemMeta(item.name)
            const rarity = getRarityStyle(meta.rarity)
            return (
              <div
                key={item.id}
                className="flex items-center gap-3 bg-craft-bg/40 border border-white/5 rounded-xl p-3 transition-all duration-200 hover:border-white/10"
              >
                {editingId === item.id ? (
                  <>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="input-field flex-1 text-sm py-1"
                      autoFocus
                    />
                    <label className="flex items-center gap-1.5 cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={editCraftable}
                        onChange={(e) => setEditCraftable(e.target.checked)}
                        className="w-3.5 h-3.5"
                      />
                      <span className="text-xs text-craft-text-muted">Craftable</span>
                    </label>
                    <button onClick={() => handleSave(item.id)} className="text-xs text-craft-green hover:text-green-400 font-medium shrink-0">
                      Save
                    </button>
                    <button onClick={handleCancelEdit} className="text-xs text-craft-text-muted hover:text-craft-text shrink-0">
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <div className={`item-icon text-lg shrink-0 ${rarity.bg} border rounded-lg`} style={{ borderColor: rarity.border.replace('border-', '') }}>
                      {meta.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-craft-text block truncate">{item.name}</span>
                      <span className="text-xs text-craft-text-muted/50">{meta.category} · {rarity.label}</span>
                    </div>
                    <span className={`text-xs shrink-0 ${item.craftable ? 'badge-crafted' : 'badge-raw'}`}>
                      {item.craftable ? 'craftable' : 'raw'}
                    </span>
                    <button
                      onClick={() => handleToggleCraftable(item)}
                      className="text-xs text-craft-text-muted hover:text-craft-gold transition-colors shrink-0 p-1"
                      title="Toggle craftable"
                    >
                      Toggle
                    </button>
                    <button
                      onClick={() => startEdit(item)}
                      className="text-craft-text-muted hover:text-craft-text transition-colors shrink-0 p-1"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-craft-text-muted hover:text-craft-accent transition-colors shrink-0 p-1"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
