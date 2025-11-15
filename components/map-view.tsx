
"use client"
import type { LatLngTuple } from "leaflet"

import "leaflet/dist/leaflet.css"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapContainer, TileLayer, Circle, LayerGroup, Polyline, CircleMarker, Marker, Tooltip, ImageOverlay, Polygon } from "react-leaflet"
import { useMapLayers } from "@/components/map-layers-context"
import MapLegendOverlay from "@/components/map-legend-overlay"
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
    const { flood, cyclone, wind, landslide, heat, basemap } = useMapLayers()
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
  // Animate cyclone: only show up to currentIdx
  const currentIdx = Math.min(track.length - 1, Math.round((step / (totalSteps - 1)) * (track.length - 1)))
  const animatedTrack = track.slice(0, currentIdx + 1)
  // Animate cone: morph polygon slightly based on step
  const baseCone: [number, number][] = [
    [16.5, 69.5],
    [17.2, 70.0],
    [18.0, 71.0],
    [18.6, 72.2],
    [19.0, 73.0],
    [19.0, 72.0],
    [18.6, 71.2],
    [18.0, 70.3],
    [17.2, 69.7],
    [16.5, 69.5],
  ]
  // Morph cone by shifting lat/lng slightly with step
  const cone: LatLngTuple[] = baseCone.map(([lat, lng], i) => [
    lat + 0.03 * Math.sin((step + i) * 0.7),
    lng + 0.03 * Math.cos((step + i) * 0.5),
  ]) as LatLngTuple[]
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
        <div className="flex-1 min-h-0 relative">
          {/* Map legend overlay */}
          <MapLegendOverlay />
          <MapContainer center={MUMBAI} zoom={7} minZoom={3} maxZoom={18} scrollWheelZoom className="h-full w-full" attributionControl={false}>
            <TileLayer url={tile.url} />
            
            {/* City Labels and Key Infrastructure (always visible) */}
            <LayerGroup>
              {/* Key Districts/Areas */}
              <CircleMarker 
                center={[19.115, 72.825]} 
                radius={4} 
                pathOptions={{ color: "#ffffff", fillColor: "#4f46e5", fillOpacity: 0.7, weight: 1 }}
              >
                <Tooltip direction="top" className="text-xs">
                  Bandra-Kurla Complex
                </Tooltip>
              </CircleMarker>
              
              <CircleMarker 
                center={[18.975, 72.825]} 
                radius={4} 
                pathOptions={{ color: "#ffffff", fillColor: "#4f46e5", fillOpacity: 0.7, weight: 1 }}
              >
                <Tooltip direction="top" className="text-xs">
                  Nariman Point
                </Tooltip>
              </CircleMarker>
              
              <CircleMarker 
                center={[19.05, 72.88]} 
                radius={4} 
                pathOptions={{ color: "#ffffff", fillColor: "#4f46e5", fillOpacity: 0.7, weight: 1 }}
              >
                <Tooltip direction="top" className="text-xs">
                  Chhatrapati Shivaji Airport
                </Tooltip>
              </CircleMarker>
              
              {/* Population Density Indicators */}
              <Circle
                center={[19.11, 72.83]}
                radius={8000}
                pathOptions={{ color: "#fbbf24", opacity: 0.3, weight: 1, fillOpacity: 0.05 }}
              >
                <Tooltip>
                  <div className="text-xs">
                    <div className="font-semibold">High Density Zone</div>
                    <div>Population: ~450,000</div>
                    <div>Density: 32k/km²</div>
                  </div>
                </Tooltip>
              </Circle>
              
              <Circle
                center={[18.98, 72.82]}
                radius={6000}
                pathOptions={{ color: "#f59e0b", opacity: 0.3, weight: 1, fillOpacity: 0.05 }}
              >
                <Tooltip>
                  <div className="text-xs">
                    <div className="font-semibold">Commercial District</div>
                    <div>Population: ~280,000</div>
                    <div>Density: 28k/km²</div>
                  </div>
                </Tooltip>
              </Circle>
            </LayerGroup>
            
            {/* Only show center circle if a hazard is active (optional, or remove entirely) */}
            {(flood || cyclone || wind || landslide || heat) && (
              <Circle
                center={MUMBAI}
                radius={25000}
                pathOptions={{ color: "#22d3ee", opacity: 0.8, weight: 1, fillOpacity: 0.15 }}
              />
            )}
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
                {/* Flood mask overlay removed: no image required */}
                
                {/* Emergency Services for Flood */}
                <CircleMarker 
                  center={[19.08, 72.82]} 
                  radius={6} 
                  pathOptions={{ color: "#ffffff", fillColor: "#dc2626", fillOpacity: 0.9, weight: 2 }}
                >
                  <Tooltip>
                    <div className="text-xs">
                      <div className="font-semibold text-red-600">Emergency Center</div>
                      <div>Rescue boats: 12</div>
                      <div>Capacity: 2,000 people</div>
                      <div>Status: Active</div>
                    </div>
                  </Tooltip>
                </CircleMarker>
                
                <CircleMarker 
                  center={[19.05, 72.91]} 
                  radius={6} 
                  pathOptions={{ color: "#ffffff", fillColor: "#059669", fillOpacity: 0.9, weight: 2 }}
                >
                  <Tooltip>
                    <div className="text-xs">
                      <div className="font-semibold text-green-600">Relief Camp</div>
                      <div>Sheltered: 850 people</div>
                      <div>Medical staff: 15</div>
                      <div>Supplies: Adequate</div>
                    </div>
                  </Tooltip>
                </CircleMarker>
                
                {/* Water Level Sensors */}
                <CircleMarker 
                  center={[19.12, 72.87]} 
                  radius={4} 
                  pathOptions={{ color: "#ffffff", fillColor: "#0891b2", fillOpacity: 0.8, weight: 1 }}
                >
                  <Tooltip>
                    <div className="text-xs">
                      <div className="font-semibold">Water Level Sensor</div>
                      <div>Current: 2.4m above normal</div>
                      <div>Trend: Rising (+0.2m/hr)</div>
                      <div>Alert: HIGH</div>
                    </div>
                  </Tooltip>
                </CircleMarker>
                
                <Tooltip permanent direction="right">
                  <span>Flood risk zones - Active monitoring</span>
                </Tooltip>
              </LayerGroup>
            )}

            {landslide && (
              <LayerGroup>
                {/* Dummy landslide heatmap using semi-transparent circles */}
                <Circle
                  center={[19.08, 72.88]}
                  radius={18000}
                  pathOptions={{ color: "#a16207", fillColor: "#fde68a", weight: 1, opacity: 0.5, fillOpacity: 0.22 }}
                />
                <Circle
                  center={[19.02, 72.92]}
                  radius={12000}
                  pathOptions={{ color: "#a16207", fillColor: "#fbbf24", weight: 1, opacity: 0.4, fillOpacity: 0.18 }}
                />
                {/* Landslide mask overlay removed: no image required */}
                
                {/* Geological Monitoring Stations */}
                <CircleMarker 
                  center={[19.09, 72.89]} 
                  radius={5} 
                  pathOptions={{ color: "#ffffff", fillColor: "#7c2d12", fillOpacity: 0.9, weight: 2 }}
                >
                  <Tooltip>
                    <div className="text-xs">
                      <div className="font-semibold text-amber-700">Slope Monitor</div>
                      <div>Tilt: 3.2° (increasing)</div>
                      <div>Soil moisture: 78%</div>
                      <div>Risk level: MODERATE</div>
                    </div>
                  </Tooltip>
                </CircleMarker>
                
                <CircleMarker 
                  center={[19.04, 72.93]} 
                  radius={5} 
                  pathOptions={{ color: "#ffffff", fillColor: "#ea580c", fillOpacity: 0.9, weight: 2 }}
                >
                  <Tooltip>
                    <div className="text-xs">
                      <div className="font-semibold text-orange-700">Seismic Station</div>
                      <div>Ground vibration: Low</div>
                      <div>Rainfall: 45mm/24h</div>
                      <div>Status: Normal</div>
                    </div>
                  </Tooltip>
                </CircleMarker>
                
                {/* High Risk Areas */}
                <CircleMarker 
                  center={[19.06, 72.90]} 
                  radius={7} 
                  pathOptions={{ color: "#fef3c7", fillColor: "#f59e0b", fillOpacity: 0.6, weight: 2 }}
                >
                  <Tooltip>
                    <div className="text-xs">
                      <div className="font-semibold text-amber-800">High Risk Zone</div>
                      <div>Evacuation recommended</div>
                      <div>Affected population: ~1,200</div>
                      <div>Last updated: 5 min ago</div>
                    </div>
                  </Tooltip>
                </CircleMarker>
                
                <Tooltip permanent direction="right">
                  <span>Landslide susceptibility - Geological monitoring active</span>
                </Tooltip>
              </LayerGroup>
            )}

            {heat && (
              <LayerGroup>
                {/* Dummy heatwave heatmap using semi-transparent circles */}
                <Circle
                  center={[19.05, 72.89]}
                  radius={20000}
                  pathOptions={{ color: "#dc2626", fillColor: "#f87171", weight: 1, opacity: 0.4, fillOpacity: 0.18 }}
                />
                <Circle
                  center={[19.1, 72.95]}
                  radius={14000}
                  pathOptions={{ color: "#b91c1c", fillColor: "#fbbf24", weight: 1, opacity: 0.3, fillOpacity: 0.13 }}
                />
                
                {/* Temperature Monitoring Stations */}
                <CircleMarker 
                  center={[19.07, 72.91]} 
                  radius={5} 
                  pathOptions={{ color: "#ffffff", fillColor: "#dc2626", fillOpacity: 0.9, weight: 2 }}
                >
                  <Tooltip>
                    <div className="text-xs">
                      <div className="font-semibold text-red-600">Weather Station</div>
                      <div>Temperature: 42.3°C</div>
                      <div>Heat Index: 48°C</div>
                      <div>Humidity: 67%</div>
                      <div>Alert: EXTREME HEAT</div>
                    </div>
                  </Tooltip>
                </CircleMarker>
                
                <CircleMarker 
                  center={[19.02, 72.87]} 
                  radius={5} 
                  pathOptions={{ color: "#ffffff", fillColor: "#ef4444", fillOpacity: 0.9, weight: 2 }}
                >
                  <Tooltip>
                    <div className="text-xs">
                      <div className="font-semibold text-red-600">Urban Heat Island</div>
                      <div>Surface temp: 46.1°C</div>
                      <div>Air temp: 41.8°C</div>
                      <div>Trend: Increasing</div>
                    </div>
                  </Tooltip>
                </CircleMarker>
                
                {/* Cooling Centers */}
                <CircleMarker 
                  center={[19.08, 72.85]} 
                  radius={6} 
                  pathOptions={{ color: "#ffffff", fillColor: "#0891b2", fillOpacity: 0.9, weight: 2 }}
                >
                  <Tooltip>
                    <div className="text-xs">
                      <div className="font-semibold text-cyan-600">Cooling Center</div>
                      <div>Capacity: 500 people</div>
                      <div>Current: 180 people</div>
                      <div>AC Status: Operational</div>
                      <div>Medical staff: Available</div>
                    </div>
                  </Tooltip>
                </CircleMarker>
                
                <CircleMarker 
                  center={[19.11, 72.88]} 
                  radius={6} 
                  pathOptions={{ color: "#ffffff", fillColor: "#0284c7", fillOpacity: 0.9, weight: 2 }}
                >
                  <Tooltip>
                    <div className="text-xs">
                      <div className="font-semibold text-blue-600">Community Center</div>
                      <div>Capacity: 300 people</div>
                      <div>Current: 85 people</div>
                      <div>Water distribution: Active</div>
                    </div>
                  </Tooltip>
                </CircleMarker>
                
                <Tooltip permanent direction="right">
                  <span>Heatwave intensity - Temperature monitoring</span>
                </Tooltip>
              </LayerGroup>
            )}

            {cyclone && (
              <LayerGroup>
                {/* Animated cyclone forecast cone polygon */}
                <Polygon
                  positions={cone}
                  pathOptions={{ color: "#fbbf24", fillColor: "#fde68a", fillOpacity: 0.25, weight: 2, opacity: 0.7 }}
                />
                {/* Animated cyclone track up to currentIdx */}
                <Polyline positions={animatedTrack} pathOptions={{ color: "#f59e0b", weight: 3, opacity: 0.9 }} />
                {animatedTrack.map((pt, idx) => (
                  <CircleMarker
                    key={idx}
                    center={pt}
                    radius={5}
                    pathOptions={{ color: "#f59e0b", fillColor: "#f59e0b", fillOpacity: idx === currentIdx ? 1 : 0.5 }}
                  >
                    <Tooltip direction="right" opacity={0.95}>
                      <div className="text-xs">
                        <div>Time: T+{idx * 6}h</div>
                        <div>Wind: {150 - idx * 5} km/h</div>
                        <div>Pressure: {975 + idx * 2} hPa</div>
                        <div>Category: {idx < 2 ? "4" : idx < 4 ? "3" : "2"}</div>
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
                    <div className="text-xs">
                      <div className="font-semibold">{`Cyclone Vardah @ T+${step}h`}</div>
                      <div>Wind: {Math.max(100, 150 - step * 2)} km/h</div>
                      <div>Movement: NE at 15 km/h</div>
                    </div>
                  </Tooltip>
                </CircleMarker>
                
                {/* Storm Surge Indicators */}
                <Circle
                  center={track[Math.min(currentIdx + 1, track.length - 1)]}
                  radius={35000}
                  pathOptions={{ color: "#0891b2", opacity: 0.4, weight: 2, fillOpacity: 0.1 }}
                >
                  <Tooltip>
                    <div className="text-xs">
                      <div className="font-semibold text-cyan-600">Storm Surge Zone</div>
                      <div>Expected height: 3-5 meters</div>
                      <div>Coastal impact: HIGH</div>
                      <div>Evacuation: Mandatory</div>
                    </div>
                  </Tooltip>
                </Circle>
                
                {/* Weather Buoys */}
                <CircleMarker 
                  center={[17.8, 70.2]} 
                  radius={4} 
                  pathOptions={{ color: "#ffffff", fillColor: "#0ea5e9", fillOpacity: 0.9, weight: 2 }}
                >
                  <Tooltip>
                    <div className="text-xs">
                      <div className="font-semibold text-blue-600">Weather Buoy #1</div>
                      <div>Wave height: 4.2m</div>
                      <div>Wind: 85 km/h NE</div>
                      <div>Pressure: 982 hPa</div>
                    </div>
                  </Tooltip>
                </CircleMarker>
                
                <CircleMarker 
                  center={[18.2, 71.1]} 
                  radius={4} 
                  pathOptions={{ color: "#ffffff", fillColor: "#0ea5e9", fillOpacity: 0.9, weight: 2 }}
                >
                  <Tooltip>
                    <div className="text-xs">
                      <div className="font-semibold text-blue-600">Weather Buoy #2</div>
                      <div>Wave height: 6.1m</div>
                      <div>Wind: 120 km/h E</div>
                      <div>Pressure: 965 hPa</div>
                    </div>
                  </Tooltip>
                </CircleMarker>
              </LayerGroup>
            )}

            {wind && (
              <LayerGroup>
                {/* Wind Direction Arrows */}
                {[
                  { pos: [18.9, 72.6], rot: 45, speed: 25 },
                  { pos: [19.0, 72.7], rot: 60, speed: 32 },
                  { pos: [19.1, 72.9], rot: 70, speed: 28 },
                  { pos: [19.2, 73.1], rot: 80, speed: 35 },
                  { pos: [19.0, 73.0], rot: 55, speed: 30 },
                  { pos: [18.95, 72.85], rot: 50, speed: 22 },
                  { pos: [19.15, 72.75], rot: 75, speed: 38 },
                ].map((w, idx) => (
                  <Marker key={idx} position={w.pos as [number, number]} icon={makeArrowIcon((w.rot + step * 5) % 360)}>
                    <Tooltip>
                      <div className="text-xs">
                        <div className="font-semibold">Wind Station {idx + 1}</div>
                        <div>Direction: {Math.round((w.rot + step * 5) % 360)}°</div>
                        <div>Speed: {w.speed + Math.round(step * 0.5)} km/h</div>
                        <div>Gusts: {w.speed + 8 + Math.round(step * 0.8)} km/h</div>
                        <div>Status: Active</div>
                      </div>
                    </Tooltip>
                  </Marker>
                ))}
                
                {/* Wind Speed Contours */}
                <Circle
                  center={[19.05, 72.85]}
                  radius={15000}
                  pathOptions={{ color: "#22d3ee", opacity: 0.5, weight: 2, fillOpacity: 0.1 }}
                >
                  <Tooltip>
                    <div className="text-xs">
                      <div className="font-semibold text-cyan-600">Moderate Wind Zone</div>
                      <div>Speed: 20-35 km/h</div>
                      <div>Advisory: Stay alert</div>
                    </div>
                  </Tooltip>
                </Circle>
                
                <Circle
                  center={[19.1, 72.9]}
                  radius={8000}
                  pathOptions={{ color: "#f59e0b", opacity: 0.6, weight: 2, fillOpacity: 0.15 }}
                >
                  <Tooltip>
                    <div className="text-xs">
                      <div className="font-semibold text-amber-600">High Wind Zone</div>
                      <div>Speed: 35-50 km/h</div>
                      <div>Advisory: Avoid outdoor activities</div>
                    </div>
                  </Tooltip>
                </Circle>
              </LayerGroup>
            )}
          </MapContainer>
        </div>

        <TimelineControls />
      </div>
    </Card>
  )
}
