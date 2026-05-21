import React, { useRef, useEffect, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF } from '@react-three/drei'
import MinglemateModel from './MinglemateModel'
import { dynamicPositions } from './positions'
import emailjs from 'emailjs-com'

// --- Mapping emoji (copié de ta Sidebar)
const emojiByName = {
  lion: '🦁',
  tigre: '🐅',
  girafe: '🦒',
  elephant: '🐘',
  requin: '🦈',
  crocodile: '🐊',
}


// -------- Utils
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

function getModelPathsForPart(part, animal) {
  if (!animal) return []
  const animalCap = capitalize(animal)
  const uniqueSuffix = `?t=${Date.now()}`
  switch (part) {
    case 'tete': return [`/models/Tete_${animalCap}.glb${uniqueSuffix}`]
    case 'buste': return [`/models/Buste_${animalCap}.glb${uniqueSuffix}`]
    case 'queue': return [`/models/Queue_${animalCap}.glb${uniqueSuffix}`]
    case 'jambe_lft': return [`/models/Patte_${animalCap}_lft.glb${uniqueSuffix}`]
    case 'jambe_rg': return [`/models/Patte_${animalCap}_rg.glb${uniqueSuffix}`]
    case 'bras_lft': return [`/models/Bras_${animalCap}_lft.glb${uniqueSuffix}`]
    case 'bras_rg': return [`/models/Bras_${animalCap}_rg.glb${uniqueSuffix}`]
    case 'short': return [`/models/Short.glb${uniqueSuffix}`]
    default: return []
  }
}

// Conversion selections → texte avec émoji (et labels FR)
const prettySelections = (sel = {}) =>
  !sel || !Object.keys(sel).length
    ? 'Aucune sélection'
    : Object.entries(sel)
        .map(([part, animal]) => {
          const emoji = emojiByName[String(animal).toLowerCase()] || animal
          const label = ({
            tete: 'Tête',
            buste: 'Corps',
            jambe_lft: 'Jambe gauche',
            jambe_rg: 'Jambe droite',
            bras_lft: 'Bras gauche',
            bras_rg: 'Bras droit',
            queue: 'Queue',
            short: 'Short',
          }[part] || part)
          return `${label} : ${emoji}`
        })
        .join('\n')

// -------- Boîte 3D cliquable
function MysteryGLB({ path, onOpen, scale = 1.2, position = [0, -1, 0] }) {
  const { scene } = useGLTF(path)
  const ref = useRef()
  const t = useRef(0)
  const baseRotation = Math.PI

  useFrame((_, dt) => {
    if (!ref.current) return
    t.current += dt
    ref.current.rotation.y = baseRotation + Math.sin(t.current) * (Math.PI / 9)
    ref.current.position.y = position[1] + Math.sin(t.current * 1.5) * 0.05
  })

  return (
    <group
      ref={ref}
      position={position}
      scale={scale}
      onClick={(e) => { e.stopPropagation(); onOpen?.() }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => (document.body.style.cursor = 'default')}
    >
      <primitive object={scene} />
    </group>
  )
}
useGLTF.preload('/models/Box.glb')

// -------- Viewer
export default function Viewer({ selections, onRandomize, revealed,
  setRevealed }) {
  
  const [boxOpacity, setBoxOpacity] = useState(1)
  const [modelOpacity, setModelOpacity] = useState(0)
  const [showHint, setShowHint] = useState(true)
  const [goldMode, setGoldMode] = useState(false)

  // ---- Formulaire EmailJS
  const [showValidate, setShowValidate] = useState(false)
  const [sending, setSending] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' })

  const baseModels = revealed ? ['/models/Short.glb'] : []
  const selectedModels = revealed
    ? Object.entries(selections || {}).flatMap(([part, animal]) =>
        getModelPathsForPart(part, animal)
      )
    : []
  const modelPaths = [...baseModels, ...selectedModels]

  const selectedBuste = selections?.buste ? selections.buste.toUpperCase() : null
  const controlsRef = useRef()

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 1.5, 0)
      controlsRef.current.object.position.set(0, 2, 20)
      controlsRef.current.update()
    }
  }, [])

  const handleReveal = () => {
    onRandomize?.()
    setShowHint(false)
    let frame = 0
    const duration = 20
    const anim = () => {
      frame++
      setBoxOpacity(1 - frame / duration)
      setModelOpacity(frame / duration)
      if (frame < duration) {
        requestAnimationFrame(anim)
      } else {
        setRevealed(true)
      }
    }
    anim()
  }

  // ---- Ouverture formulaire
  const handleOpenValidate = () => {
    setShowValidate(true)
    setErrorMsg('')
  }

  // ---- Envoi EmailJS
  const handleSend = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!form.firstName || !form.lastName || !form.email) {
      setErrorMsg('Merci de remplir Nom, Prénom et Email.')
      return
    }

    setSending(true)
    try {
      const templateParams = {
        to_name: 'Minglemates',
        first_name: form.firstName,
        last_name: form.lastName,
        user_email: form.email,
        selections_text: prettySelections(selections),
        selections_json: JSON.stringify(selections, null, 2),
      }

      // 👉 REMPLACE ICI PAR TES VALEURS EMAILJS
      const SERVICE_ID = 'service_qddbafc'
      const TEMPLATE_ID = 'template_Minglemates'
      const PUBLIC_KEY = '6ZsY9j6-nxxNYDW-y'

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)

      setShowValidate(false)
      setForm({ firstName: '', lastName: '', email: '' })
      alert('Merci ! Votre Minglemate a été validé 🎉')
    } catch (err) {
      console.error(err)
      setErrorMsg("Échec de l'envoi. Réessaie dans un instant.")
    } finally {
      setSending(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        background: 'transparent',
      }}
    >


      {/* ✅ Texte indicatif responsive */}
      {showHint && (
        <div
          style={{
            position: 'absolute',
            bottom: '25%',
            left: '20%',
            transform: 'translateX(-50%)',
            color: '#ffcc00',
            fontSize: 'clamp(20px, 2vw, 25px)',
            fontWeight: 'bold',
            zIndex: 30,
            textAlign: 'center',
            textShadow: '0px 2px 10px DarkBlue',
            animation: 'bounceText 1s infinite',
          }}
        >
          
        </div>
      )}

      {revealed && (
        <button
          onClick={onRandomize}
          style={{
            position: 'absolute',
            bottom: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20,
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
          }}
        >
          <img
            src="/actualiser.png"
            alt="Générer aléatoirement"
            style={{
              width: 'clamp(50px, 20vw, 100px)',
              height: 'auto',
              display: 'block'
            }}
          />
        </button>
      )}

      {/* ✅ Canvas 3D */}
      <Canvas camera={{ position: [0, 3, 28], fov: 50 }} gl={{ preserveDrawingBuffer: true, alpha: true, useLegacyLights: false }}>
        <ambientLight intensity={1} />
        <Environment preset="sunset" />
        <OrbitControls
          ref={controlsRef}
          target={[-1, 7, 0]}
          enablePan
          enabled={revealed}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 6}
        />

        <Suspense fallback={null}>
          {!revealed && (
            <MysteryGLB
              path="/models/Box.glb"
              onOpen={handleReveal}
            />
          )}

          {modelPaths.map((path) => {
            let part = 'short'
            if (path.includes('Tete_')) part = 'Tete'
            else if (path.includes('Buste_')) part = 'buste'
            else if (path.includes('Queue_')) part = 'queue'
            else if (path.includes('Patte_') && path.includes('_lft')) part = 'jambe_lft'
            else if (path.includes('Patte_') && path.includes('_rg')) part = 'jambe_rg'
            else if (path.includes('Bras_') && path.includes('_lft')) part = 'Bras_lft'
            else if (path.includes('Bras_') && path.includes('_rg')) part = 'Bras_rg'

            let position = [0, 0, 0]
            if (
              selectedBuste &&
              (part === 'Tete' || part === 'Bras_lft' || part === 'Bras_rg' || part === 'queue') &&
              dynamicPositions[selectedBuste] &&
              dynamicPositions[selectedBuste][part]
            ) {
              position = dynamicPositions[selectedBuste][part]
            }

            return (
              <MinglemateModel
                key={path}
                path={path}
                position={position}
                scale={1}
                opacity={modelOpacity}
                gold={goldMode}
              />
            )
          })}
        </Suspense>
      </Canvas>

      {/* ---- Modal Validation ---- */}
      {showValidate && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowValidate(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSend}
            style={{
              width: 'min(90vw, 420px)',
              background: '#0c1e4a',
              color: 'white',
              border: '2px solid #ffcc00',
              borderRadius: 12,
              padding: 16,
              boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: 12 }}>Valider mon Minglemate</h3>

            <div style={{ display: 'grid', gap: 10 }}>
              <label>
                Prénom
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => setForm(f => ({ ...f, firstName: e.target.value }))}
                  style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #335' }}
                  required
                />
              </label>

              <label>
                Nom
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setForm(f => ({ ...f, lastName: e.target.value }))}
                  style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #335' }}
                  required
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                  style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #335' }}
                  required
                />
              </label>

              <div style={{ background: '#10295c', borderRadius: 8, padding: 10, fontSize: 12, whiteSpace: 'pre-wrap' }}>
                <strong>Personnage choisi :</strong>
                <br />
                {prettySelections(selections)}
              </div>

              {errorMsg && (
                <div style={{ color: '#ff7676', fontSize: 12 }}>{errorMsg}</div>
              )}

              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowValidate(false)}
                  style={{
                    flex: 1, padding: 10, borderRadius: 8, border: '1px solid #335',
                    background: '#1a2a5a', color: '#fff', cursor: 'pointer'
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  style={{
                    flex: 1, padding: 10, borderRadius: 8, border: 'none',
                    background: '#ffcc00', color: '#0c1e4a', fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  {sending ? 'Envoi…' : 'Envoyer'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ✅ Animation bounce */}
      <style>
        {`
          @keyframes bounceText {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
        `}
      </style>
    </div>
  )
}
