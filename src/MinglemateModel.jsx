// MinglemateModel.jsx
import { useGLTF } from '@react-three/drei'
import { useEffect, useMemo } from 'react'
import * as THREE from 'three'

export default function MinglemateModel({
  path,
  position = [0, 0, 0],
  scale = 1,
  opacity = 1,
  gold = false, // ← toggle global
}) {
  const { scene } = useGLTF(path)

  // Matériau or (réutilisé, pas recréé à chaque render)
  const goldMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#FFD54D',
    metalness: 1,
    roughness: 0.2,
    reflectivity: 1,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    envMapIntensity: 1.2,
  }), [])

  // 1) A la première passe: mémoriser les matériaux d’origine
  useEffect(() => {
    scene.traverse((child) => {
      if (!child.isMesh) return

      // stocke l’original s’il n’est pas déjà mémorisé
      if (!child.userData._origMaterial) {
        // Si le mesh a un array de materials, clone-les tous
        if (Array.isArray(child.material)) {
          child.userData._origMaterial = child.material.map(m => m.clone())
        } else {
          child.userData._origMaterial = child.material.clone()
        }
      }
    })
  }, [scene])

  // 2) A chaque changement de props: appliquer gold / original + opacité + scale
  useEffect(() => {
    scene.scale.set(scale, scale, scale)

    scene.traverse((child) => {
      if (!child.isMesh) return

      // Choisir quel matériau appliquer
      let targetMat
      if (gold) {
        // Or : utiliser le même goldMat (ou un array rempli de goldMat si mesh multi-mat)
        targetMat = Array.isArray(child.userData._origMaterial)
          ? child.userData._origMaterial.map(() => goldMat)
          : goldMat
      } else {
        // Original depuis le cache
        targetMat = child.userData._origMaterial || child.material
      }

      // Appliquer opacité sur le(s) matériau(x) cible(s)
      const applyOpacity = (mat) => {
        mat.transparent = true
        mat.opacity = opacity
      }

      if (Array.isArray(targetMat)) {
        targetMat.forEach(applyOpacity)
      } else {
        applyOpacity(targetMat)
      }

      // Assigner sur le mesh
      child.material = targetMat
      child.material.needsUpdate = true
    })
  }, [scene, scale, opacity, gold, goldMat])

  return <primitive object={scene} position={position} />
}

useGLTF.preload('/Visionneuse/models/Short.glb')
