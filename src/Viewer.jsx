import React, { useRef, useEffect, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF } from '@react-three/drei'
import MinglemateModel from './MinglemateModel'
import { dynamicPositions } from './positions'

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

function getModelPathsForPart(part, animal) {
  if (!animal) return []
  const animalCap = capitalize(animal)
  const uniqueSuffix = `?t=${Date.now()}`
  switch (part) {
    case 'tete': return [`/Visionneuse/models/Tete_${animalCap}.glb${uniqueSuffix}`]
    case 'buste': return [`/Visionneuse/models/Buste_${animalCap}.glb${uniqueSuffix}`]
    case 'queue': return [`/Visionneuse/models/Queue_${animalCap}.glb${uniqueSuffix}`]
    case 'jambe_lft': return [`/Visionneuse/models/Patte_${animalCap}_lft.glb${uniqueSuffix}`]
    case 'jambe_rg': return [`/Visionneuse/models/Patte_${animalCap}_rg.glb${uniqueSuffix}`]
    case 'bras_lft': return [`/Visionneuse/models/Bras_${animalCap}_lft.glb${uniqueSuffix}`]
    case 'bras_rg': return [`/Visionneuse/models/Bras_${animalCap}_rg.glb${uniqueSuffix}`]
    case 'short': return [`/Visionneuse/models/Short.glb${uniqueSuffix}`]
    default: return []
  }
}

/** Boîte cliquable */
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
useGLTF.preload('/Visionneuse/models/Box.glb')

export default function Viewer({ selections, onRandomize }) {
  const [revealed, setRevealed] = useState(false)
  const [boxOpacity, setBoxOpacity] = useState(1)
  const [modelOpacity, setModelOpacity] = useState(0)
  const [showHint, setShowHint] = useState(true)
  const modelScale = 0.5

  const baseModels = revealed ? ['/Visionneuse/models/Short.glb'] : []
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

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        background: 'linear-gradient(to top, #a8d0f0, #0f1c4d)',
      }}
    >
      {/* ✅ Logo responsive */}
      <img
        src="/Visionneuse/logo.png"
        alt="Logo MingleMates"
        style={{
          position: 'absolute',
          top: '2%',
          left: '25%',
          width: '100vw',
          maxWidth: '250px',
          height: 'auto',
          zIndex: 10,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />

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
          Clique sur la boite!<br /> Révéle ton MINGLEMATE
        </div>
      )}

      {revealed && (
        <button
          onClick={onRandomize}
          style={{
            position: 'absolute',
            bottom: '10%',
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
            src="/Visionneuse/actualiser.png"
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
      <Canvas camera={{ position: [0, 3, 28], fov: 50 }} gl={{ preserveDrawingBuffer: true, alpha: true }}>
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
              path="/Visionneuse/models/Box.glb"
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
              (part === 'Tete' || part === 'Bras_lft' || part === 'Bras_rg') &&
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
              />
            )
          })}
        </Suspense>
      </Canvas>

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
