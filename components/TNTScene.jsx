"use client"
import React, { useRef, useState } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Sphere, Cylinder } from '@react-three/drei'
import { Physics, useSphere } from '@react-three/cannon'
import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import helvetikerFont from 'three/examples/fonts/helvetiker_regular.typeface.json'

// הרחבת R3F כדי לתמוך בטקסט
extend({ TextGeometry })
const font = new FontLoader().parse(helvetikerFont)

function AnimatedBomb(props) {
  const [ref] = useSphere(() => ({ mass: 2, position: [0, 1, 0], ...props }))
  const lightRef = useRef()
  const [intensity, setIntensity] = useState(1)

  // אנימציה של אור שמתפשט ומתעמעם
  useFrame(({ clock }) => {
    const pulse = Math.sin(clock.getElapsedTime() * 5) * 0.5 + 1
    setIntensity(pulse)
    if (lightRef.current) lightRef.current.intensity = pulse * 2
  })

  return (
    <group ref={ref}>
      {/* גוף הפצצה */}
      <Sphere args={[1, 32, 32]}>
        <meshStandardMaterial color="black" metalness={0.3} roughness={0.5} />
      </Sphere>
      
      {/* פתיל */}
      <Cylinder args={[0.1, 0.1, 0.5, 16]} position={[0, 1.2, 0]}>
        <meshStandardMaterial color="gray" />
      </Cylinder>
      
      {/* להבה בקצה הפתיל */}
      <pointLight ref={lightRef} color="red" position={[0, 1.5, 0]} intensity={intensity} />
      
      {/* טקסט TNT */}
      <mesh position={[-0.4, 0, 1]}>
        <textGeometry args={["TNT", { font: font, size: 0.3, height: 0.1 }]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </group>
  )
}

export default function BombScene() {
  return (
    <Canvas shadows>
      <PerspectiveCamera makeDefault position={[0, 3, 5]} />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Physics>
        <AnimatedBomb />
      </Physics>
    </Canvas>
  )
}
