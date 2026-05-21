import React, { useState } from 'react'
import Viewer from './Viewer'
import Tabsidebar from './Tabsidebar'

const CATEGORIES = [
  { key: 'buste' }, { key: 'tete' },
  { key: 'jambe_lft' }, { key: 'jambe_rg' },
  { key: 'bras_lft' }, { key: 'bras_rg' },
  { key: 'queue' },
]

const ANIMAUX = [
  'lion','tigre','girafe','elephant','crocodile','tortue'
]

export default function App() {
  const [selections, setSelections] = useState({})
  const [revealed, setRevealed] = useState(false)

  const handleSelectPart = (part, animal) => {
    setSelections(prev => ({ ...prev, [part]: animal }))
  }

  const randomizeSelection = () => {
    const next = {}
    CATEGORIES.forEach(cat => {
      next[cat.key] =
        ANIMAUX[Math.floor(Math.random() * ANIMAUX.length)]
    })
    setSelections(next)
  }

  return (
    <div style={{
      width:'100vw',
      height:'100vh',
      position:'relative',
      overflow:'hidden'
    }}>

      {revealed && (
        <Tabsidebar
          selections={selections}
          onSelectPart={handleSelectPart}
        />
      )}

      <Viewer
        selections={selections}
        onRandomize={randomizeSelection}
        revealed={revealed}
        setRevealed={setRevealed}
      />

    </div>
  )
}