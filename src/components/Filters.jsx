export default function Filters({ filters, onChange }) {
  const toggle = (key) => {
    onChange({ ...filters, [key]: !filters[key] })
  }

  const options = [
    { key: 'craftableOnly', label: 'Craftable Only', icon: '⚒️' },
    { key: 'rawOnly', label: 'Raw Materials', icon: '🪨' },
    { key: 'missingOnly', label: 'Missing Items', icon: '❌' },
    { key: 'favoritesOnly', label: 'Favorites', icon: '⭐' },
    { key: 'rareOnly', label: 'Rare+ Items', icon: '💎' },
  ]

  return (
    <div className="flex items-center flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => toggle(opt.key)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 border ${
            filters[opt.key]
              ? 'bg-craft-accent/10 border-craft-accent/30 text-craft-accent'
              : 'bg-white/[0.03] border-white/5 text-craft-text-muted hover:border-white/20 hover:text-craft-text'
          }`}
        >
          <span>{opt.icon}</span>
          {opt.label}
        </button>
      ))}
    </div>
  )
}
