import { useState } from 'react'
import { FiX, FiPlus } from 'react-icons/fi'

export default function AddItemModal({ open, onClose, onCreated, supabase, items }) {
  const [name, setName] = useState('')
  const [craftable, setCraftable] = useState(false)
  const [saving, setSaving] = useState(false)

  if (!open) return null

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return

    setSaving(true)
    try {
      const { data, error } = await supabase
        .from('items')
        .insert({ name: name.trim(), craftable })
        .select()
        .single()
      if (error) {
        if (error.code === '23505') {
          alert('An item with that name already exists.')
        } else {
          alert('Failed to add item: ' + error.message)
        }
        return
      }
      onCreated(data)
      onClose()
      setName('')
      setCraftable(false)
    } catch (e) {
      alert('Failed to add item')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-dark-800 border border-dark-600 rounded-xl w-full max-w-md mx-4 overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-dark-600">
          <h2 className="font-semibold">Add New Item</h2>
          <button onClick={onClose} className="text-dark-300 hover:text-dark-50 transition-colors">
            <FiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm text-dark-200 mb-1.5">Item Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Iron Ingot"
              className="w-full px-3 py-2.5 bg-dark-700 border border-dark-500 rounded-lg text-dark-50 placeholder-dark-300 focus:outline-none focus:border-accent transition-colors"
              autoFocus
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={craftable}
              onChange={(e) => setCraftable(e.target.checked)}
              className="w-4 h-4 rounded border-dark-500 bg-dark-700 accent-accent"
            />
            <span className="text-sm text-dark-200">This item can be crafted (has a recipe)</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-dark-600 hover:bg-dark-500 rounded-lg transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="flex-1 px-4 py-2.5 bg-accent hover:bg-accent-hover disabled:opacity-50 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              {saving ? 'Saving...' : <><FiPlus /> Add Item</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
