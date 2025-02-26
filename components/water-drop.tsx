"use client"

import { useEffect, useState, useRef } from "react"

interface WaterDropProps {
  id: number
  initialPosition: [number, number, number]
  waterLevel: number
  onSplash: (id: number) => void
  hasSplashed: boolean
}

export default function WaterDrop({
  id,
  initialPosition,
  waterLevel,
  onSplash,
  hasSplashed
}: WaterDropProps) {
  const [top, setTop] = useState(0)
  const [, setHasSplashed] = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const velocityRef = useRef(1)

  // Animate the drop falling
  useEffect(() => {
    const animate = () => {
      setTop((prevTop) => {
        // Accelerate as the drop falls
        velocityRef.current += 0.2
        const newTop = prevTop + velocityRef.current

        // Check if drop has hit the water surface
        if (newTop >= 100 - waterLevel && !hasSplashed) {
          setHasSplashed(true)
          onSplash(id)
          return 100 - waterLevel // Stop at water surface
        }

        return newTop
      })

      if (!hasSplashed) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [id, waterLevel, hasSplashed, onSplash])

  return (
    <div className="absolute z-10" style={{ left: `${left}%`, top: `${top}%` }}>
      {/* Water drop */}
      {!hasSplashed && (
        <div ref={dropRef} className="h-6 w-4 rounded-b-full rounded-t-[50%] bg-blue-400/80 shadow-inner" />
      )}

      {/* Water splash effect */}
      {hasSplashed && (
        <div className="relative">
          {/* Center splash */}
          <div className="absolute left-0 bottom-0 h-4 w-4 animate-splash-center rounded-full bg-blue-300/80" />

          {/* Splash particles */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute left-0 bottom-0 h-2 w-2 rounded-full bg-blue-300/80"
              style={{
                animation: `splash-particle 0.5s ease-out forwards`,
                transform: `rotate(${i * 45}deg)`,
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

