import React from "react"
import { useMapLayers } from "@/components/map-layers-context"

export default function MapLegendOverlay() {
  const { flood, cyclone, wind, landslide, heat } = useMapLayers()
  return (
    <div
      style={{
        position: "absolute",
        bottom: 18,
        right: 18,
        zIndex: 1000,
        background: "rgba(24,24,24,0.85)",
        borderRadius: 6,
        padding: "6px 10px",
        minWidth: 140,
        color: "#fff",
        fontSize: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
        pointerEvents: "auto",
      }}
      className="shadow-lg border border-border/40"
    >
      <div className="font-semibold mb-1 text-xs">Legend</div>
      <ul className="space-y-1">
        {flood && (
          <li className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-cyan-400/80 inline-block" aria-hidden />
            <span>Flood zones & sensors</span>
          </li>
        )}
        {cyclone && (
          <li className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-amber-400/80 inline-block" aria-hidden />
            <span>Cyclone track & buoys</span>
          </li>
        )}
        {wind && (
          <li className="flex items-center gap-1">
            <span
              className="h-2 w-2 rotate-45 border-l-2 border-r-2 border-transparent border-b-4 border-b-amber-300 inline-block"
              aria-hidden
            />
            <span>Wind stations & speed</span>
          </li>
        )}
        {landslide && (
          <li className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-yellow-400/80 inline-block" aria-hidden />
            <span>Landslide risk & monitors</span>
          </li>
        )}
        {heat && (
          <li className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-red-400/80 inline-block" aria-hidden />
            <span>Heat zones & cooling centers</span>
          </li>
        )}
        {!flood && !cyclone && !wind && !landslide && !heat && (
          <li className="text-xs text-muted-foreground">No data layers active.</li>
        )}
      </ul>
    </div>
  )
}
