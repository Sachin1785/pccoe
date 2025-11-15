"use client"

import type React from "react"
import { createContext, useContext, useMemo, useState } from "react"

type Basemap = "dark" | "light" | "satellite"
type Module = "flood" | "cyclone" | "heat" | "wind" | "landslide"

type MapLayersState = {
  flood: boolean
  cyclone: boolean
  wind: boolean
  landslide: boolean
  heat: boolean
  basemap: Basemap
  module: Module
  setFlood: (v: boolean) => void
  setCyclone: (v: boolean) => void
  setWind: (v: boolean) => void
  setLandslide: (v: boolean) => void
  setHeat: (v: boolean) => void
  setBasemap: (b: Basemap) => void
  setModule: (m: Module) => void
}

const MapLayersContext = createContext<MapLayersState | null>(null)

export function MapLayersProvider({ children }: { children: React.ReactNode }) {
  const [flood, setFlood] = useState<boolean>(true)
  const [cyclone, setCyclone] = useState<boolean>(false)
  const [wind, setWind] = useState<boolean>(false)
  const [landslide, setLandslide] = useState<boolean>(false)
  const [heat, setHeat] = useState<boolean>(false)
  const [basemap, setBasemap] = useState<Basemap>("satellite")
  const [module, setModule] = useState<Module>("flood")

  const value = useMemo(
    () => ({ flood, cyclone, wind, landslide, heat, basemap, module, setFlood, setCyclone, setWind, setLandslide, setHeat, setBasemap, setModule }),
    [flood, cyclone, wind, landslide, heat, basemap, module],
  )

  return <MapLayersContext.Provider value={value}>{children}</MapLayersContext.Provider>
}

export function useMapLayers() {
  const ctx = useContext(MapLayersContext)
  if (!ctx) throw new Error("useMapLayers must be used within MapLayersProvider")
  return ctx
}
