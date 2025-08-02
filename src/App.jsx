import { useState } from 'react'
import Sidebar from './Sidebar'
import Viewer from './Viewer'

const categories = [
  'buste',
  'tete',
  'jambe_lft',
  'jambe_rg',
  'bras_lft',
  'bras_rg',
  'queue',
]

const animaux = [
  'lion',
  'hippopotame',
  'corbeau',
  'tigre',
  'girafe',
  'perroquet',
  'mouton',
  'vache',
  'elephant',
  'dauphin',
  'requin',
  'cameleon',
  'crocodile',
  'tortue',
  'cochon',
]

function getRandomAnimal() {
  const idx = Math.floor(Math.random() * animaux.length)
  return animaux[idx]
}

export default function App() {
  const [selections, setSelections] = useState({})

  const handleSelectPart = (part, animal) => {
    setSelections((prev) => ({
      ...prev,
      [part]: animal,
    }))
  }

  const randomizeSelection = () => {
    const newSelection = {}
    categories.forEach((cat) => {
      newSelection[cat] = getRandomAnimal()
    })
    setSelections(newSelection)
  }

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
      <Sidebar
        selections={selections}
        onSelectPart={handleSelectPart}
        onRandomize={randomizeSelection}
      />
      <div
        style={{
          flexGrow: 1,
          background: 'linear-gradient(to top, #a8d0f0, #0f1c4d)',
          padding: '1rem',
          borderLeft: '4px solid #FFC524', // liseré jaune entre sidebar et viewer
        }}
      >
        <Viewer selections={selections} />
      </div>
    </div>
  )
}
