"use client"

import { useEffect, useState } from "react"
import WaterDrop from "@/components/water-drop"
import { formatTime } from "@/lib/utils"

export default function WaterClock() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [drops, setDrops] = useState<{ id: number; left: number }[]>([])
  const [nextDropId, setNextDropId] = useState(0)

  // Calculate water level based on time of day (0-100%)
  const getWaterLevel = () => {
    const hours = currentTime.getHours()
    const minutes = currentTime.getMinutes()
    const seconds = currentTime.getSeconds()

    const totalSeconds = hours * 3600 + minutes * 60 + seconds
    const percentOfDay = (totalSeconds / 86400) * 100

    return percentOfDay
  }

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Create new drops periodically
  useEffect(() => {
    const dropInterval = setInterval(() => {
      const left = Math.random() * 100 // Random position (0-100%)
      setDrops((prev) => [...prev, { id: nextDropId, left }])
      setNextDropId((prev) => prev + 1)
    }, 2000)

    return () => clearInterval(dropInterval)
  }, [nextDropId])

  const waterLevel = getWaterLevel()

  const handleDropSplash = (id: number) => {
    // Remove the drop after animation completes
    setTimeout(() => {
      setDrops((prev) => prev.filter((drop) => drop.id !== id))
    }, 1000)
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-sky-950">
      {/* Water background */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-blue-400 transition-all duration-1000"
        style={{ height: `${waterLevel}%` }}
      >
        {/* Water surface effect */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-blue-300 to-transparent opacity-50"></div>

        {/* Water ripples */}
        <div className="absolute top-0 left-0 right-0 h-12 overflow-hidden">
          <div className="water-ripple"></div>
          <div className="water-ripple delay-300"></div>
          <div className="water-ripple delay-600"></div>
        </div>
      </div>

      {/* Water drops */}
      {drops.map((drop) => (
        <WaterDrop key={drop.id} id={drop.id} left={drop.left} waterLevel={waterLevel} onSplash={handleDropSplash} />
      ))}

      {/* Time display */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="rounded-full bg-white/20 p-8 shadow-lg backdrop-blur-sm">
          <h1 className="text-6xl font-bold text-white drop-shadow-md">{formatTime(currentTime)}</h1>
        </div>
      </div>
    </div>
  )
}

