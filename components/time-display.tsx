"use client"

import { useState, useEffect } from "react"
import { formatTime } from "@/lib/utils"

export default function TimeDisplay() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null)

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!currentTime) return null

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      <div className="rounded-full bg-white/30 p-8 shadow-lg backdrop-blur-md">
        <h1 className="text-6xl font-bold text-white drop-shadow-md">{formatTime(currentTime)}</h1>
      </div>
    </div>
  )
}

