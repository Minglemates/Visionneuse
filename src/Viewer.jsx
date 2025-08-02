import React, { useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
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
    case 'tete':
      return [`/models/Tete_${animalCap}.glb${uniqueSuffix}`]
    case 'buste':
      return [`/models/Buste_${animalCap}.glb${uniqueSuffix}`]
    case 'queue':
      return [`/models/Queue_${animalCap}.glb${uniqueSuffix}`]
    case 'jambe_lft':
      return [`/models/Patte_${animalCap}_lft.glb${uniqueSuffix}`]
    case 'jambe_rg':
      return [`/models/Patte_${animalCap}_rg.glb${uniqueSuffix}`]
    case 'bras_lft':
      return [`/models/Bras_${animalCap}_lft.glb${uniqueSuffix}`]
    case 'bras_rg':
      return [`/models/Bras_${animalCap}_rg.glb${uniqueSuffix}`]
    case 'short':
      return [`/models/Short.glb${uniqueSuffix}`]
    default:
      return []
  }
}

export default function Viewer({ selections }) {
  const QUEUE_POSITION = [-0.17, 0.05, -0.175]
  const baseModels = ['/models/Short.glb']
  const selectedModels = Object.entries(selections || {}).flatMap(([part, animal]) =>
    getModelPathsForPart(part, animal)
  )
  const modelPaths = [...baseModels, ...selectedModels]

  const selectedBuste = selections?.buste ? selections.buste.toUpperCase() : null
  const controlsRef = useRef()

  // Positionne la caméra au montage initial seulement
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 1.5, 0)
      controlsRef.current.object.position.set(0, 2, 20)
      controlsRef.current.update()
    }
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <img
        src="/logo.png"
        alt="Logo MingleMates"
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          width: 300,
          height: 'auto',
          zIndex: 10,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />

      <Canvas camera={{ position: [0, 2, 20], fov: 50 }} gl={{ preserveDrawingBuffer: true, alpha: true }}>
        <ambientLight intensity={1} />
        <Environment preset="sunset" />
        <OrbitControls
          ref={controlsRef}
          target={[0, 8, 0]}
          enablePan={true}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 6}
        />
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
          if (part === 'queue') position = QUEUE_POSITION
          else if (
            selectedBuste &&
            (part === 'Tete' || part === 'Bras_lft' || part === 'Bras_rg') &&
            dynamicPositions[selectedBuste] &&
            dynamicPositions[selectedBuste][part]
          )
            position = dynamicPositions[selectedBuste][part]

          return <MinglemateModel key={path} path={path} position={position} scale={1} />
        })}
      </Canvas>
    </div>
  )
}
