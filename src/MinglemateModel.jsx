import { useGLTF } from '@react-three/drei'

export default function MinglemateModel({ path, position, scale = 1 }) {
  const { scene } = useGLTF(path)
  return <primitive object={scene} position={position} scale={scale} />
}
