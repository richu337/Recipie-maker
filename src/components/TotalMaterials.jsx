import { FiLayers, FiCopy } from 'react-icons/fi'
import { useState } from 'react'

export default function TotalMaterials({ materials, itemsMap }) {
  const [copied, setCopied] = useState(false)

  const entries = Object.entries(materials).sort((a, b) => {
    const nameA = (itemsMap.get(Number(a[0]))?.name || '').toLowerCase()
    const nameB = (itemsMap.get(Number(b[0]))?.name || '').toLowerCase()
    return nameA.localeCompare(nameB)
  })

  function handleCopy() {
    const text = entries
      .map(([id, qty]) => {
        const item = itemsMap.get(Number(id))
        return `${Math.round(qty * 100) / 100}x ${item?.name || '???'}`
      })
      .join('\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (entries.length === 0) {
    return (
      <div className="bg-dark-800/50 border border-dark-600 rounded-xl p-8 text-center">
        <FiLayers className="mx-auto text-3xl text-dark-400 mb-2" />
        <p className="text-dark-300">No materials calculated</p>
        <p className="text-dark-400 text-sm mt-1">Add items and set quantities above</p>
      </div>
    )
  }

  return (
    <div className="bg-dark-800 border border-dark-600 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-dark-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold">Total Materials Required</h2>
          <span className="px-2 py-0.5 text-xs bg-accent/20 text-accent rounded-full">
            {entries.length}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-dark-600 hover:bg-dark-500 rounded-lg transition-colors"
        >
          <FiCopy size={13} />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="divide-y divide-dark-600">
        {entries.map(([id, qty]) => {
          const item = itemsMap.get(Number(id))
          if (!item) return null
          return (
            <div key={id} className="px-5 py-3.5 flex items-center justify-between hover:bg-dark-700/50 transition-colors">
              <span className="font-medium">{item.name}</span>
              <span className="text-lg font-bold text-accent">
                {Math.round(qty * 100) / 100}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
