"use client"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { useMapLayers } from "@/components/map-layers-context"
import { useToast } from "@/hooks/use-toast"

export default function LeftPanel() {
  const { flood, cyclone, wind, landslide, heat, setFlood, setCyclone, setWind, setLandslide, setHeat, basemap, setBasemap, module, setModule } = useMapLayers()
  const [forecastOpen, setForecastOpen] = useState(false)
  const { toast } = useToast()

  return (
    <div className="h-full overflow-auto p-3">
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">Hazard Modules</h2>
        <Tabs value={module} onValueChange={(v) => setModule(v as any)}>
          <TabsList className="grid grid-cols-4 w-full text-xs">
            <TabsTrigger
              value="flood"
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-600 dark:data-[state=active]:text-cyan-400"
              onClick={() => {
                setModule("flood")
                setFlood(true)
                setBasemap("satellite") // Auto-switch to satellite for flood
                setCyclone(false)
                setLandslide(false)
                setHeat(false)
              }}
            >
              Flood
            </TabsTrigger>
            <TabsTrigger
              value="cyclone"
              className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-600 dark:data-[state=active]:text-amber-400"
              onClick={() => {
                setModule("cyclone")
                setCyclone(true)
                setBasemap("satellite") // Auto-switch to satellite for cyclone
                setFlood(false)
                setLandslide(false)
                setHeat(false)
              }}
            >
              Cyclone
            </TabsTrigger>
            <TabsTrigger 
              value="heat"
              onClick={() => {
                setModule("heat")
                setHeat(true)
                setBasemap("satellite") // Auto-switch to satellite for heat
                setFlood(false)
                setCyclone(false)
                setLandslide(false)
              }}
            >
              {"Heat"}
            </TabsTrigger>
            <TabsTrigger 
              value="landslide"
              className="data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-600 dark:data-[state=active]:text-yellow-400"
              onClick={() => {
                setModule("landslide")
                setLandslide(true)
                setBasemap("satellite") // Auto-switch to satellite for landslide
                setFlood(false)
                setCyclone(false)
                setHeat(false)
              }}
            >
              Landslide
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </section>

      <Separator className="my-4" />

      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">Base & Layers</h2>
        <div className="space-y-2">
          {/* Basemap selector */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Basemap</p>
            <Select
              value={basemap}
              onValueChange={(v) => {
                setBasemap(v as any)
                toast({
                  title: "Basemap changed",
                  description: `Basemap set to ${v}`,
                })
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select basemap" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="satellite">Satellite</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Layers header just for grouping; toggles below */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm">Flood Risk</p>
              <p className="text-xs text-muted-foreground">Shows estimated inundation zones</p>
            </div>
            <Switch
              checked={flood}
              onCheckedChange={(v) => {
                setFlood(v)
                toast({
                  title: "Layer updated",
                  description: `Flood layer ${v ? "enabled" : "disabled"}`,
                })
              }}
              aria-label="Toggle Flood Layer"
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm">Landslide Risk</p>
              <p className="text-xs text-muted-foreground">Susceptibility heatmap (mock)</p>
            </div>
            <Switch
              checked={landslide}
              onCheckedChange={(v) => {
                setLandslide(v)
                toast({
                  title: "Layer updated",
                  description: `Landslide risk ${v ? "enabled" : "disabled"}`,
                })
              }}
              aria-label="Toggle Landslide Layer"
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm">Heatwave Intensity</p>
              <p className="text-xs text-muted-foreground">Heatmap overlay (mock)</p>
            </div>
            <Switch
              checked={heat}
              onCheckedChange={(v) => {
                setHeat(v)
                toast({
                  title: "Layer updated",
                  description: `Heatwave intensity ${v ? "enabled" : "disabled"}`,
                })
              }}
              aria-label="Toggle Heatwave Layer"
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm">Cyclone Path</p>
              <p className="text-xs text-muted-foreground">Best track and forecast cone</p>
            </div>
            <Switch
              checked={cyclone}
              onCheckedChange={(v) => {
                setCyclone(v)
                toast({
                  title: "Layer updated",
                  description: `Cyclone path ${v ? "enabled" : "disabled"}`,
                })
              }}
              aria-label="Toggle Cyclone Layer"
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm">Wind Field</p>
              <p className="text-xs text-muted-foreground">Surface wind direction samples</p>
            </div>
            <Switch
              checked={wind}
              onCheckedChange={(v) => {
                setWind(v)
                toast({
                  title: "Layer updated",
                  description: `Wind field ${v ? "enabled" : "disabled"}`,
                })
              }}
              aria-label="Toggle Wind Layer"
            />
          </div>
        </div>
      </section>

      <Separator className="my-4" />

      <section aria-label="Forecasting" className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">Forecasting</h2>
        <div className="space-y-2">
          <Sheet open={forecastOpen} onOpenChange={setForecastOpen}>
            <SheetTrigger asChild>
              <Button size="sm" className="w-full justify-start">
                Advanced Forecast Panel
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[380px] sm:w-[480px]">
              <SheetHeader>
                <SheetTitle>New Forecast Configuration</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-5">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-semibold">Scenario</p>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="flex-1">Best Case</Button>
                    <Button variant="secondary" size="sm" className="flex-1">Expected</Button>
                    <Button variant="secondary" size="sm" className="flex-1">Worst Case</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-semibold">Forecast Horizon</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">6h</Button>
                    <Button variant="outline" size="sm">12h</Button>
                    <Button variant="outline" size="sm">24h</Button>
                    <Button variant="outline" size="sm">48h</Button>
                    <Button variant="outline" size="sm">72h</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-semibold">Hazard Type</p>
                  <div className="flex gap-2 flex-wrap">
                    <Button variant="ghost" size="sm">Flood</Button>
                    <Button variant="ghost" size="sm">Cyclone</Button>
                    <Button variant="ghost" size="sm">Heatwave</Button>
                    <Button variant="ghost" size="sm">Landslide</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-semibold">Location</p>
                  <input type="text" className="w-full px-2 py-1 rounded border bg-background text-foreground text-sm" placeholder="Enter city, district, or coordinates" />
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-semibold">Advanced Options</p>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-xs">
                      <input type="checkbox" className="accent-primary" /> Include population impact
                    </label>
                    <label className="flex items-center gap-2 text-xs">
                      <input type="checkbox" className="accent-primary" /> Show infrastructure risk
                    </label>
                    <label className="flex items-center gap-2 text-xs">
                      <input type="checkbox" className="accent-primary" /> Enable uncertainty bands
                    </label>
                  </div>
                </div>
                <div className="pt-2 flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() =>
                      toast({
                        title: "Forecast generated",
                        description: "A new forecast has been generated and applied.",
                      })
                    }
                  >
                    Generate Forecast
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => setForecastOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </section>
    </div>
  )
}
