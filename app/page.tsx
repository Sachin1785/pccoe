"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import LeftPanel from "@/components/left-panel"
import dynamic from "next/dynamic"
const MapView = dynamic(() => import("@/components/map-view"), { ssr: false })
import RightPanel from "@/components/right-panel"
import { MapLayersProvider } from "@/components/map-layers-context"
import { TimelineProvider } from "@/components/timeline-context"

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Mobile guard */}
      <section className="md:hidden flex min-h-screen items-center justify-center p-6 text-center">
        <div className="max-w-sm">
          <h1 className="text-2xl font-semibold mb-2 text-balance">Project INDRA</h1>
          <p className="text-muted-foreground">
            This command center is optimized for desktop screens. Please open on a device with a larger display to
            continue.
          </p>
        </div>
      </section>

      {/* Desktop three-column layout */}
      <section aria-label="Command Center Layout" className="hidden md:flex h-screen gap-4 p-4">
        <TimelineProvider>
          <MapLayersProvider>
            <aside aria-label="Controls panel" className="w-80 flex-shrink-0">
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-cyan-400">INDRA Controls</CardTitle>
                </CardHeader>
                <CardContent className="h-[calc(100%-3.5rem)] p-0">
                  <LeftPanel />
                </CardContent>
              </Card>
            </aside>

            <section aria-label="Map view" className="flex-1 min-w-0">
              <MapView />
            </section>

            <aside aria-label="Information panel" className="w-96 flex-shrink-0">
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle>Info</CardTitle>
                </CardHeader>
                <CardContent className="h-[calc(100%-3.5rem)] p-0">
                  <RightPanel />
                </CardContent>
              </Card>
            </aside>
          </MapLayersProvider>
        </TimelineProvider>
      </section>
    </main>
  )
}
