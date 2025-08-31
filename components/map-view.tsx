"use client"

import "leaflet/dist/leaflet.css"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapContainer, TileLayer, Circle, LayerGroup, Polyline, CircleMarker, Marker, Tooltip } from "react-leaflet"
import { useMapLayers } from "@/components/map-layers-context"
import { useTimeline } from "@/components/timeline-context"
import TimelineControls from "@/components/timeline-controls"
import { useToast } from "@/hooks/use-toast"
import L from "leaflet"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Share2 } from "lucide-react"
import ThemeToggle from "@/components/theme-toggle"

const MUMBAI: [number, number] = [19.076, 72.8777]

function makeArrowIcon(rotationDeg: number) {
  return L.divIcon({
    className: "wind-arrow",
    html: `<div style="transform: rotate(${rotationDeg}deg); width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-bottom: 10px solid #f5d48b;"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  })
}

export default function MapView() {
  const { flood, cyclone, wind, basemap } = useMapLayers()
  const { step, totalSteps } = useTimeline()
  const { toast } = useToast()

  const tile = (() => {
    switch (basemap) {
      case "light":
        return {
          url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
          attribution: '&copy; OSM, &copy; <a href="https://carto.com/attributions">CARTO</a>',
        }
      case "satellite":
        return {
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          attribution:
            "Tiles &copy; Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
        }
      default:
        return {
          url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
          attribution: '&copy; OSM, &copy; <a href="https://carto.com/attributions">CARTO</a>',
        }
    }
  })()

  function handleExportCSV() {
    const rows = [
      ["key", "value"],
      ["basemap", basemap],
      ["flood", String(flood)],
      ["cyclone", String(cyclone)],
      ["wind", String(wind)],
      ["timeline_step", String(step)],
      ["timeline_total", String(totalSteps)],
    ]
    const csv = rows.map((r) => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    const ts = new Date().toISOString().replace(/[:.]/g, "-")
    a.href = url
    a.download = `indra-export-${ts}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast({ title: "Exported CSV", description: "Downloaded current view state as CSV." })
  }

  async function handleShare() {
    const params = new URLSearchParams({
      basemap,
      flood: String(flood),
      cyclone: String(cyclone),
      wind: String(wind),
      step: String(step),
    })
    const origin = typeof window !== "undefined" ? window.location.origin : ""
    const shareUrl = origin ? `${origin}?${params.toString()}` : `?${params.toString()}`
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl)
        toast({ title: "Link copied", description: "Shareable link copied to clipboard." })
      } else {
        throw new Error("Clipboard not available")
      }
    } catch {
      toast({ title: "Copy failed", description: "Could not copy link to clipboard.", variant: "destructive" as any })
    }
  }

  function handleExportImage() {
    toast({
      title: "Image export not available",
      description: "PNG export will be available in production.",
    })
  }

  const track: [number, number][] = [
    [16.5, 69.5],
    [17.2, 70.3],
    [18.0, 71.2],
    [18.6, 72.0],
    [19.0, 72.5],
  ]
  const currentIdx = Math.min(track.length - 1, Math.round((step / (totalSteps - 1)) * (track.length - 1)))
  const floodRadiusCore = 30000 + step * 600
  const floodRadiusRing = 50000 + step * 800

  return (
    <Card className="h-full p-0 overflow-hidden">
      {/* Header bar */}
      <div className="h-10 border-b border-border/60 px-4 flex items-center justify-between bg-secondary/20">
        {/* Breadcrumb replaces previous text title */}
        <div className="text-sm text-muted-foreground">
          <Breadcrumb aria-label="Map location">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>India</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator>{">"}</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>Maharashtra</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator>{">"}</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>Mumbai</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center gap-2">
          {/* Grouped Export dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportImage}>as PNG</DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportCSV}>as CSV</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button size="sm" className="bg-cyan-500/20 text-cyan-400" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>

          {/* Theme toggle button */}
          <ThemeToggle />
        </div>
      </div>

      <div className="h-[calc(100%-2.5rem)] flex flex-col">
        <div className="flex-1 min-h-0">
          <MapContainer center={MUMBAI} zoom={7} minZoom={3} maxZoom={18} scrollWheelZoom className="h-full w-full">
            <TileLayer url={tile.url} attribution={tile.attribution} />
            <Circle
              center={MUMBAI}
              radius={25000}
              pathOptions={{ color: "#22d3ee", opacity: 0.8, weight: 1, fillOpacity: 0.15 }}
            />
            {flood && (
              <LayerGroup>
                <Circle
                  center={[19.1, 72.85]}
                  radius={floodRadiusCore}
                  pathOptions={{ color: "#06b6d4", fillColor: "#06b6d4", weight: 1, opacity: 0.6, fillOpacity: 0.25 }}
                />
                <Circle
                  center={[19.03, 72.9]}
                  radius={floodRadiusRing}
                  pathOptions={{ color: "#22d3ee", fillColor: "#22d3ee", weight: 1, opacity: 0.4, fillOpacity: 0.15 }}
                />
                <Tooltip permanent direction="right">
                  <span>Flood risk zones (mock)</span>
                </Tooltip>
              </LayerGroup>
            )}

            {cyclone && (
              <LayerGroup>
                <Polyline positions={track} pathOptions={{ color: "#f59e0b", weight: 3, opacity: 0.9 }} />
                {track.map((pt, idx) => (
                  <CircleMarker
                    key={idx}
                    center={pt}
                    radius={5}
                    pathOptions={{ color: "#f59e0b", fillColor: "#f59e0b", fillOpacity: idx === currentIdx ? 1 : 0.5 }}
                  >
                    {/* Add on-hover tooltip with placeholder content */}
                    <Tooltip direction="right" opacity={0.95}>
                      <div className="text-xs">
                        <div>Date: 2025-09-01 12:00 UTC</div>
                        <div>Max Wind Speed: 150 km/h</div>
                        <div>Category: 2</div>
                      </div>
                    </Tooltip>
                  </CircleMarker>
                ))}
                <CircleMarker
                  center={track[currentIdx]}
                  radius={7}
                  pathOptions={{ color: "#f59e0b", fillColor: "#f59e0b", fillOpacity: 1 }}
                >
                  <Tooltip permanent direction="right">
                    <span>{`Cyclone @ T+${step}h`}</span>
                  </Tooltip>
                </CircleMarker>
              </LayerGroup>
            )}

            {wind && (
              <LayerGroup>
                {[
                  { pos: [18.9, 72.6], rot: 45 },
                  { pos: [19.0, 72.7], rot: 60 },
                  { pos: [19.1, 72.9], rot: 70 },
                  { pos: [19.2, 73.1], rot: 80 },
                  { pos: [19.0, 73.0], rot: 55 },
                ].map((w, idx) => (
                  <Marker key={idx} position={w.pos as [number, number]} icon={makeArrowIcon((w.rot + step * 5) % 360)}>
                    <Tooltip>{`Wind ${(w.rot + step * 5) % 360}°`}</Tooltip>
                  </Marker>
                ))}
              </LayerGroup>
            )}
          </MapContainer>
        </div>

        <TimelineControls />
      </div>
    </Card>
  )
}
