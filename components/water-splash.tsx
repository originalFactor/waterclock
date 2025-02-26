"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface WaterSplashProps {
  position: [number, number, number]
  dropId: number
}

interface SplashParticle {
  position: THREE.Vector3
  velocity: THREE.Vector3
  scale: number
  lifetime: number
  age: number
}

export default function WaterSplash({ position, dropId }: WaterSplashProps) {
  // Create particles for the splash effect
  const createSplashParticles = useCallback((): SplashParticle[] => {
    return Array.from({ length: 20 }, () => ({
      position: new THREE.Vector3(position[0], position[1], position[2]),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.5, // Increased spread
        Math.random() * 0.8, // Higher upward velocity
        (Math.random() - 0.5) * 0.5, // Increased spread
      ),
      scale: Math.random() * 0.1 + 0.05, // Larger particles
      lifetime: Math.random() * 1.0 + 1.0, // Longer lifetime
      age: 0,
    }))
  }, [position])

  const [particles, setParticles] = useState<SplashParticle[]>([])
  const [completed, setCompleted] = useState(false)
  const initialized = useRef(false)

  // Initialize particles
  useEffect(() => {
    if (!initialized.current) {
      console.log(`Creating splash for drop ${dropId} at position [${position[0]}, ${position[1]}, ${position[2]}]`)
      setParticles(createSplashParticles())
      initialized.current = true
    }
  }, [position, dropId, createSplashParticles])

  // Animate splash particles
  useFrame((_, delta) => {
    if (completed || particles.length === 0) return

    let allComplete = true

    setParticles((prevParticles) =>
      prevParticles.map((particle) => {
        // Update age
        const newAge = particle.age + delta

        if (newAge < particle.lifetime) {
          allComplete = false

          // Update position based on velocity
          particle.position.add(particle.velocity.clone().multiplyScalar(delta * 5))

          // Add gravity effect
          particle.velocity.y -= delta * 3

          return {
            ...particle,
            age: newAge,
            position: particle.position,
            velocity: particle.velocity,
          }
        }

        return particle
      }),
    )

    if (allComplete) {
      console.log(`Splash for drop ${dropId} completed`)
      setCompleted(true)
    }
  })

  // Debug log
  useEffect(() => {
    console.log(`Splash for drop ${dropId} has ${particles.length} particles`)

    return () => {
      console.log(`Splash for drop ${dropId} unmounted`)
    }
  }, [dropId, particles.length])

  if (completed) {
    console.log(`Splash for drop ${dropId} is marked as completed and will not render`)
    return null
  }

  if (particles.length === 0) {
    console.log(`Splash for drop ${dropId} has no particles to render`)
    return null
  }

  return (
    <group>
      {particles.map((particle, i) => (
        <mesh
          key={i}
          position={[particle.position.x, particle.position.y, particle.position.z]}
          scale={particle.scale * Math.max(0, 1 - particle.age / particle.lifetime)}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial
            color="#88ccff"
            transparent
            opacity={Math.max(0, 0.9 * (1 - particle.age / particle.lifetime))}
            roughness={0.1}
            emissive="#4488ff"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  )
}

