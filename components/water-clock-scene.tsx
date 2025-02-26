"use client"

import { useEffect, useState, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import WaterSurface from "@/components/water-surface"
import WaterDrop from "@/components/water-drop"

export default function WaterClockScene() {
  const [drops, setDrops] = useState<{ id: number; position: [number, number, number] }[]>([])
  const [nextDropId, setNextDropId] = useState(0)
  const [waterLevel, setWaterLevel] = useState(0)
  const splashesRef = useRef<Map<number, boolean>>(new Map())

  // Calculate water level based on time of day (0-1)
  useEffect(() => {
    const updateWaterLevel = () => {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()
      const seconds = now.getSeconds()

      const totalSeconds = hours * 3600 + minutes * 60 + seconds
      const percentOfDay = totalSeconds / 86400

      setWaterLevel(percentOfDay)
    }

    updateWaterLevel()
    const timer = setInterval(updateWaterLevel, 1000)

    return () => clearInterval(timer)
  }, [])

  // Create new drops periodically
  useEffect(() => {
    const createDrop = () => {
      // Random position on top of the scene
      const x = (Math.random() - 0.5) * 10
      const z = (Math.random() - 0.5) * 10
      const y = 10 // Start from above the scene

      const newDrop = { id: nextDropId, position: [x, y, z] as [number, number, number] }
      setDrops((prev) => [...prev, newDrop])
      setNextDropId((prev) => prev + 1)
    }

    const dropInterval = setInterval(createDrop, 3000) // Reduced frequency for debugging

    return () => clearInterval(dropInterval)
  }, [nextDropId])

  const handleSplash = (id: number) => {
    console.log(`Handling splash for drop ${id}`)

    // Mark this drop as having splashed
    splashesRef.current.set(id, true)

    // Remove the drop after the splash animation completes
    // Increased timeout to allow splash to be visible
    setTimeout(() => {
      console.log(`Removing drop ${id} after splash animation`)
      setDrops((prev) => prev.filter((drop) => drop.id !== id))
      splashesRef.current.delete(id)
    }, 3000) // Increased from 1000 to 3000ms
  }

  // Calculate the water surface position
  const waterSurfacePosition: [number, number, number] = [0, -5 + waterLevel * 10, 0]

  // Debug log
  useEffect(() => {
    console.log(`Water level: ${waterLevel}, Water surface position: ${waterSurfacePosition[1]}`)
    console.log(`Active drops: ${drops.length}`)
  }, [waterLevel, drops.length, waterSurfacePosition[1]])

  return (
    <Canvas camera={{ position: [0, 5, 10], fov: 55 }}>
      <color attach="background" args={["#001020"]} />
      <fog attach="fog" args={["#001020", 15, 25]} />

      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />

      {/* Render water surface */}
      <WaterSurface position={waterSurfacePosition} scale={[15, 1, 15]} />

      {/* Render water drops */}
      {drops.map((drop) => (
        <WaterDrop
          key={drop.id}
          id={drop.id}
          initialPosition={drop.position}
          waterLevel={waterSurfacePosition[1]}
          onSplash={handleSplash}
          hasSplashed={splashesRef.current.get(drop.id) || false}
        />
      ))}

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.2}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
      />
    </Canvas>
  )
}

