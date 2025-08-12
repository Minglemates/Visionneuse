import React, { useState } from 'react'
import Viewer from './Viewer'
import Tabsidebar from './Tabsidebar'

// Clés utilisées pour la randomisation
const CATEGORIES = [
  { key: 'buste' }, { key: 'tete' },
  { key: 'jambe_lft' }, { key: 'jambe_rg' },
  { key: 'bras_lft' }, { key: 'bras_rg' },
  { key: 'queue' },
]

// Liste simple pour la randomisation (doit matcher vos noms de fichiers glb)
const ANIMAUX = [
  'lion','hippopotame','corbeau','tigre','girafe','perroquet',
  'mouton','vache','elephant','dauphin','requin','cameleon',
  'crocodile','tortue','cochon'
]

export default function App() {
  const [selections, setSelections] = useState({})

  const handleSelectPart = (part, animal) => {
    setSelections(prev => ({ ...prev, [part]: animal }))
  }

  const randomizeSelection = () => {
    const next = {}
    CATEGORIES.forEach(cat => {
      next[cat.key] = ANIMAUX[Math.floor(Math.random() * ANIMAUX.length)]
    })
    setSelections(next)
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Sidebar est FIXE, hors du layout */}
      <Tabsidebar selections={selections} onSelectPart={handleSelectPart} />
      {/* Le viewer occupe tout l’écran */}
      <Viewer selections={selections} onRandomize={randomizeSelection} />
    </div>
  )
}
