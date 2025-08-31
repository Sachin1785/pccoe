"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

type Speed = 0.5 | 1 | 2

type TimelineState = {
  step: number
  totalSteps: number
  playing: boolean
  speed: Speed
  setStep: (s: number) => void
  setPlaying: (p: boolean) => void
  stepForward: () => void
  stepBack: () => void
  setSpeed: (s: Speed) => void
}

const TimelineContext = createContext<TimelineState | null>(null)

export function TimelineProvider({
  children,
  totalSteps = 12,
}: {
  children: React.ReactNode
  totalSteps?: number
}) {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState<Speed>(1)

  // Auto-advance when playing, respecting speed
  useEffect(() => {
    if (!playing) return
    const intervalMs = 800 / speed // base 800ms per step at 1x
    const id = setInterval(() => {
      setStep((prev) => (prev + 1) % totalSteps)
    }, intervalMs)
    return () => clearInterval(id)
  }, [playing, speed, totalSteps])

  const value = useMemo<TimelineState>(
    () => ({
      step,
      totalSteps,
      playing,
      speed,
      setStep: (s) => setStep(Math.max(0, Math.min(totalSteps - 1, Math.floor(s)))),
      setPlaying,
      stepForward: () => setStep((s) => (s + 1) % totalSteps),
      stepBack: () => setStep((s) => (s - 1 + totalSteps) % totalSteps),
      setSpeed,
    }),
    [step, totalSteps, playing, speed],
  )

  return <TimelineContext.Provider value={value}>{children}</TimelineContext.Provider>
}

export function useTimeline() {
  const ctx = useContext(TimelineContext)
  if (!ctx) throw new Error("useTimeline must be used within TimelineProvider")
  return ctx
}
