import React, { useState } from 'react'

const categories = [
  { label: 'Corps', key: 'buste' },
  { label: 'Tête', key: 'tete' },
  { label: 'Jambe Gauche', key: 'jambe_lft' },
  { label: 'Jambe Droite', key: 'jambe_rg' },
  { label: 'Bras Gauche', key: 'bras_lft' },
  { label: 'Bras Droite', key: 'bras_rg' },
  { label: 'Queue', key: 'queue' },
]

const animaux = [
  { name: 'lion', emoji: '🦁' },
  { name: 'hippopotame', emoji: '🦛' },
  { name: 'corbeau', emoji: '🐦' },
  { name: 'tigre', emoji: '🐅' },
  { name: 'girafe', emoji: '🦒' },
  { name: 'perroquet', emoji: '🦜' },
  { name: 'mouton', emoji: '🐑' },
  { name: 'vache', emoji: '🐄' },
  { name: 'elephant', emoji: '🐘' },
  { name: 'dauphin', emoji: '🐬' },
  { name: 'requin', emoji: '🦈' },
  { name: 'cameleon', emoji: '🦎' },
  { name: 'crocodile', emoji: '🐊' },
  { name: 'tortue', emoji: '🐢' },
  { name: 'cochon', emoji: '🐖' },
]

export default function Sidebar({ selections, onSelectPart, onRandomize }) {
  const [activeCategory, setActiveCategory] = useState(null)

  const toggleCategory = (key) => {
    setActiveCategory(activeCategory === key ? null : key)
  }

  return (
    <div
      style={{
        width: '250px',
        background: '#0c1e4a',
        color: 'white',
        padding: '1rem',
        fontFamily: 'Arial, sans-serif',
        height: '100vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        textAlign: 'center',
      }}
    >
      <div>
        {categories.map(({ label, key }) => (
          <div key={key} style={{ marginBottom: '1rem' }}>
            <div
              style={{
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                padding: '0.25rem 0',
                borderBottom: '3px solid #ffcc00',
                textShadow: '2px 2px 2px #6a99ffff',
              }}
              onClick={() => toggleCategory(key)}
            >
              {label}
            </div>
            {activeCategory === key && (
              <div
                style={{
                  marginTop: '0.5rem',
                  paddingLeft: '1rem',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                {animaux.map(({ name, emoji }) => (
                  <div
                    key={name}
                    onClick={() => onSelectPart(key, name)}
                    style={{
                      cursor: 'pointer',
                      padding: '0.3rem 0.5rem',
                      borderRadius: '6px',
                      backgroundColor: selections[key] === name ? '#ffcc00' : 'transparent',
                      color: selections[key] === name ? '#0c1e4a' : 'white',
                      userSelect: 'none',
                      fontSize: '1.3rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '40px',
                      transition: 'background-color 0.2s, color 0.2s',
                    }}
                    title={name.charAt(0).toUpperCase() + name.slice(1)}
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={onRandomize}
        style={{
          marginTop: '40px',
          backgroundColor: '#ffcc00',
          color: '#ffffffff',
          border: 'none',
          borderRadius: '10px',
          padding: '0.5rem',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          whiteSpace: 'normal',
          lineHeight: '1.2',
          textAlign: 'center',
          boxShadow: '0 0 10px #ffcc00',
          userSelect: 'none',
        }}
        title="Générer aléatoirement"
      >
         Générer<br />aléatoirement
      </button>
    </div>
  )
}
