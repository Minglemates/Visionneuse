import { useGLTF } from '@react-three/drei'
import { useEffect } from 'react'

export default function MinglemateModel({ path, position = [0, 0, 0], scale = .5, opacity = 1 }) {
  const { scene } = useGLTF(path)

  useEffect(() => {
    // 🔹 Forcer l'échelle globale
    scene.scale.set(scale, scale, scale)

    // 🔹 Appliquer l'opacité
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material.transparent = true
        child.material.opacity = opacity
      }
    })
  }, [opacity, scale, scene])

  return <primitive object={scene} position={position} />
}

useGLTF.preload('/Visionneuse/models/Short.glb')
