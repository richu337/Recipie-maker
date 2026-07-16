import { getItemMeta, getRarityStyle } from '../data/itemMeta.js'

export default function ItemCard({ name, need, owned = 0, craftable = false, onClick }) {
  const meta = getItemMeta(name)
  const rarity = getRarityStyle(meta.rarity)
  const missing = Math.max(0, need - owned)
  const progress = need > 0 ? Math.min(100, (owned / need) * 100) : 0

  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl border bg-craft-surface/40 backdrop-blur-sm p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-craft-accent/5 cursor-pointer"
      style={{ borderColor: rarity.border.replace('border-', '') }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/[0.02] pointer-events-none" />

      <div className="flex items-start gap-3">
        <div className={`item-icon text-2xl ${rarity.bg} ${rarity.border} border rounded-xl shrink-0`}>
          {meta.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-craft-text truncate">{name}</span>
            {craftable && <span className="badge-crafted shrink-0">crafted</span>}
          </div>

          <div className="mt-2 space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-craft-text-muted">Need:</span>
              <span className="text-craft-text font-mono font-bold tabular-nums">
                {Math.round(need * 100) / 100}
              </span>
            </div>
            {owned > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-craft-text-muted">Owned:</span>
                <span className="text-craft-green font-mono tabular-nums">
                  {Math.round(owned * 100) / 100}
                </span>
              </div>
            )}
            {missing > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-craft-text-muted">Missing:</span>
                <span className="text-craft-accent font-mono tabular-nums">
                  {Math.round(missing * 100) / 100}
                </span>
              </div>
            )}
          </div>

          <div className="mt-3 space-y-1">
            <div className="progress-bar" style={{ borderColor: rarity.border.replace('border-', '') }}>
              <div
                className={`progress-bar-fill ${progress >= 100 ? 'bg-craft-green' : 'bg-gradient-to-r from-craft-accent to-craft-accent-glow'}`}
                style={{ width: `${Math.min(100, progress)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-craft-text-muted">
              <span>{Math.round(progress)}%</span>
              <span>{Math.round(owned)} / {Math.round(need)}</span>
            </div>
          </div>

          {owned > 0 && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-craft-green">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Owned
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
