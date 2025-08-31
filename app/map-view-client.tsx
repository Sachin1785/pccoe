"use client"

import dynamic from "next/dynamic"

const ClientMapView = dynamic(() => import("../components/map-view"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-muted-foreground text-sm">Loading map…</div>
  ),
})

export default function MapViewClient() {
  return <ClientMapView />
}
