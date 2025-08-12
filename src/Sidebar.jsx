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
  { name: 'lion', emoji: '🦁' }, { name: 'hippopotame', emoji: '🦛' },
  { name: 'corbeau', emoji: '🐦' }, { name: 'tigre', emoji: '🐅' },
  { name: 'girafe', emoji: '🦒' }, { name: 'perroquet', emoji: '🦜' },
  { name: 'mouton', emoji: '🐑' }, { name: 'vache', emoji: '🐄' },
  { name: 'elephant', emoji: '🐘' }, { name: 'dauphin', emoji: '🐬' },
  { name: 'requin', emoji: '🦈' }, { name: 'cameleon', emoji: '🦎' },
  { name: 'crocodile', emoji: '🐊' }, { name: 'tortue', emoji: '🐢' },
  { name: 'cochon', emoji: '🐖' },
]

const PANEL_WIDTH = 250
const TAB_WIDTH = 40

export default function Sidebar({ selections, onSelectPart }) {
  const [activeCategory, setActiveCategory] = useState(null)
  const [open, setOpen] = useState(false)

  const toggleCategory = (key) => {
    setActiveCategory(activeCategory === key ? null : key)
  }
  const toggleSidebar = () => setOpen(v => !v)

  return (
    // WRAPPER: sa largeur vaut 40px fermé (juste l’onglet), 250px ouvert
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: open ? PANEL_WIDTH : TAB_WIDTH,
        zIndex: 10000,
        // On ne met PAS de background ici, seulement dans le panneau
      }}
    >
      {/* PANNEAU qui glisse à l’intérieur du wrapper */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: PANEL_WIDTH,
          height: '100%',
          backgroundColor: '#0c1e4a',
          color: 'white',
          overflowY: 'auto',
          boxShadow: '2px 0 10px rgba(0,0,0,0.25)',
          transform: open ? 'translateX(0)' : `translateX(${TAB_WIDTH - PANEL_WIDTH}px)`, // -210px
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        {/* Onglet qui SUIT (collé au bord droit du panneau) */}
        <button
          onClick={toggleSidebar}
          style={{
            position: 'absolute',
            top: '40%',
            right: -TAB_WIDTH,
            width: TAB_WIDTH,
            height: 120,
            backgroundColor: '#ffcc00',
            color: '#0c1e4a',
            border: 'none',
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
            cursor: 'pointer',
            fontWeight: 'bold',
            writingMode: 'vertical-rl',
            textOrientation: 'upright',
            boxShadow: '2px 2px 6px rgba(0,0,0,0.25)',
          }}
          title={open ? 'Fermer' : 'Ouvrir'}
        >
          {open ? '⟨⟨' : 'MENU'}
        </button>

        {/* Contenu (affiché même pendant l’anim) */}
        <div style={{ padding: '1rem', paddingTop: '3rem' }}>
          {categories.map(({ label, key }) => (
            <div key={key} style={{ marginBottom: '1rem' }}>
              <div
                style={{
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  padding: '0.25rem 0',
                  borderBottom: '3px solid #ffcc00',
                }}
                onClick={() => toggleCategory(key)}
              >
                {label}
              </div>

              {activeCategory === key && (
                <div
                  style={{
                    marginTop: '0.5rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  {animaux.map(({ name, emoji }) => (
                    <div
                      key={name}
                      onClick={() => onSelectPart(key, name)}
                      title={name[0].toUpperCase() + name.slice(1)}
                      style={{
                        cursor: 'pointer',
                        padding: '0.3rem 0.5rem',
                        borderRadius: 6,
                        backgroundColor: selections[key] === name ? '#ffcc00' : 'transparent',
                        color: selections[key] === name ? '#0c1e4a' : 'white',
                        fontSize: '1.3rem',
                        userSelect: 'none',
                        transition: 'background-color .15s, color .15s',
                      }}
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
