"use client"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTimeline } from "./timeline-context"

export default function TimelineControls() {
  const { step, totalSteps, playing, speed, setStep, setPlaying, stepBack, stepForward, setSpeed } = useTimeline()

  return (
    <div
      className="flex items-center gap-3 border-t border-border/60 px-3 py-2 bg-background/70"
      role="region"
      aria-label="Timeline controls"
    >
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={stepBack} aria-label="Step Back">
          {"⏮"}
        </Button>
        <Button
          size="sm"
          onClick={() => setPlaying(!playing)}
          aria-label={playing ? "Pause playback" : "Play playback"}
          className={playing ? "bg-cyan-500/20 text-cyan-400" : ""}
        >
          {playing ? "⏸" : "▶"}
        </Button>
        <Button variant="outline" size="sm" onClick={stepForward} aria-label="Step Forward">
          {"⏭"}
        </Button>
      </div>

      <div className="flex-1">
        <Slider
          value={[step]}
          min={0}
          max={totalSteps - 1}
          step={1}
          onValueChange={(v) => setStep(v[0] ?? 0)}
          aria-label="Timeline scrubber"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground w-16 text-right">{`T+${step}h`}</span>
        <Select value={String(speed)} onValueChange={(v) => setSpeed(Number(v) as any)}>
          <SelectTrigger className="h-8 w-24">
            <SelectValue placeholder="Speed" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0.5">0.5x</SelectItem>
            <SelectItem value="1">1x</SelectItem>
            <SelectItem value="2">2x</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
