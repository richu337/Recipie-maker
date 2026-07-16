import { useState, useEffect } from 'react'

const STORAGE_KEY = 'recipe-maker-projects'

function loadProjects() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
}

export default function SaveProjects({ selections, onLoad }) {
  const [projects, setProjects] = useState([])
  const [name, setName] = useState('')
  const [showSave, setShowSave] = useState(false)

  useEffect(() => {
    setProjects(loadProjects())
  }, [])

  const handleSave = () => {
    if (!name.trim() || selections.length === 0) return
    const project = { id: Date.now(), name: name.trim(), selections: JSON.parse(JSON.stringify(selections)) }
    const updated = [...projects, project]
    setProjects(updated)
    saveProjects(updated)
    setName('')
    setShowSave(false)
  }

  const handleLoad = (project) => {
    onLoad(project.selections)
  }

  const handleDelete = (id) => {
    const updated = projects.filter(p => p.id !== id)
    setProjects(updated)
    saveProjects(updated)
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {showSave ? (
          <div className="flex items-center gap-2 animate-slide-down">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Project name..."
              className="input-field text-sm py-1.5 w-40"
              autoFocus
              onKeyDown={e => e.key === 'Enter' && handleSave()}
            />
            <button onClick={handleSave} disabled={!name.trim() || selections.length === 0} className="btn-primary text-xs py-1.5 px-3">
              Save
            </button>
            <button onClick={() => setShowSave(false)} className="btn-ghost text-xs py-1.5 px-2">
              Cancel
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => setShowSave(true)}
              disabled={selections.length === 0}
              className="btn-ghost text-xs py-1.5 px-3 flex items-center gap-1.5"
            >
              <span>💾</span>
              Save
            </button>
            {projects.length > 0 && (
              <div className="relative group">
                <button className="btn-ghost text-xs py-1.5 px-3 flex items-center gap-1.5">
                  <span>📂</span>
                  Load ({projects.length})
                </button>
                <div className="absolute right-0 top-full mt-1 w-56 rounded-xl border border-white/10 bg-craft-surface/95 backdrop-blur-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 max-h-64 overflow-y-auto">
                  {projects.map(p => (
                    <div key={p.id} className="flex items-center gap-2 p-2.5 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                      <button
                        onClick={() => handleLoad(p)}
                        className="flex-1 text-left text-sm text-craft-text truncate"
                      >
                        {p.name}
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-craft-text-muted hover:text-craft-accent transition-colors shrink-0 p-1"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
