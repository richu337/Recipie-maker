import { useState } from 'react'

export default function ItemManager({ items, onAddItem, onUpdateItem, onDeleteItem, onRefresh }) {
  const [name, setName] = useState('')
  const [craftable, setCraftable] = useState(false)
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editCraftable, setEditCraftable] = useState(false)

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

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-lg font-semibold text-craft-text mb-4">Add New Item</h2>
        <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs text-craft-muted mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="e.g. Iron Ingot"
              required
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={craftable}
              onChange={(e) => setCraftable(e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 bg-craft-bg text-craft-accent focus:ring-craft-accent"
            />
            <span className="text-sm text-craft-text">Craftable</span>
          </label>
          <button type="submit" disabled={adding || !name.trim()} className="btn-primary whitespace-nowrap">
            {adding ? 'Adding...' : 'Add Item'}
          </button>
        </form>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-craft-text mb-4">
          All Items ({items.length})
        </h2>

        {items.length === 0 && (
          <p className="text-craft-muted text-sm text-center py-4">No items yet.</p>
        )}

        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 bg-craft-bg rounded-lg p-3"
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
                    <span className="text-xs text-craft-muted">Craftable</span>
                  </label>
                  <button onClick={() => handleSave(item.id)} className="text-craft-green hover:text-green-400 text-sm font-medium shrink-0">
                    Save
                  </button>
                  <button onClick={handleCancelEdit} className="text-craft-muted hover:text-craft-text text-sm shrink-0">
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span className={`w-2 h-2 rounded-full shrink-0 ${item.craftable ? 'bg-craft-purple' : 'bg-craft-blue'}`} />
                  <span className="text-craft-text flex-1 min-w-0 truncate">{item.name}</span>
                  <span className={`text-xs ${item.craftable ? 'badge-crafted' : 'badge-raw'}`}>
                    {item.craftable ? 'craftable' : 'raw'}
                  </span>
                  <button
                    onClick={() => handleToggleCraftable(item)}
                    className="text-craft-muted hover:text-craft-gold text-xs transition-colors shrink-0"
                    title="Toggle craftable"
                  >
                    Toggle
                  </button>
                  <button
                    onClick={() => startEdit(item)}
                    className="text-craft-muted hover:text-craft-text transition-colors shrink-0"
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-craft-muted hover:text-craft-accent transition-colors shrink-0"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
