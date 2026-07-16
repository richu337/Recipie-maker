import { useState } from 'react'

export default function SeedBanner({ onSeed }) {
  const [seeding, setSeeding] = useState(false)

  async function handleSeed() {
    setSeeding(true)
    try {
      await onSeed()
    } catch {
      alert('Failed to seed data. Check your Firebase config.')
    } finally {
      setSeeding(false)
    }
  }

  return (
    <div className="card border-craft-accent/40 bg-craft-accent/5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-craft-text font-semibold text-lg m-0">Welcome to Recipe & Material Calculator</h2>
          <p className="text-craft-muted text-sm mt-1">
            Your Firebase project is connected but the database is empty.
            Click to seed it with <strong>59 items</strong> and <strong>33 recipes</strong>.
          </p>
        </div>
        <button onClick={handleSeed} disabled={seeding} className="btn-primary whitespace-nowrap">
          {seeding ? 'Seeding...' : 'Seed Database'}
        </button>
      </div>
    </div>
  )
}
