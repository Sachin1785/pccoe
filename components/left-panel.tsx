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
  const { flood, cyclone, wind, setFlood, setCyclone, setWind, basemap, setBasemap, module, setModule } = useMapLayers()
  const [forecastOpen, setForecastOpen] = useState(false)
  const { toast } = useToast()

  return (
    <div className="h-full overflow-auto p-3">
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">Hazard Modules</h2>
        <Tabs value={module} onValueChange={(v) => setModule(v as any)}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger
              value="flood"
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-600 dark:data-[state=active]:text-cyan-400"
            >
              Flood
            </TabsTrigger>
            <TabsTrigger
              value="cyclone"
              className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-600 dark:data-[state=active]:text-amber-400"
            >
              Cyclone
            </TabsTrigger>
            <TabsTrigger value="heat">{"Heat"}</TabsTrigger>
            <TabsTrigger value="wind">{"Wind"}</TabsTrigger>
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
                Run New Forecast
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 sm:w-96">
              <SheetHeader>
                <SheetTitle>Forecast Settings</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Configure forecast horizon and scenario. This is a placeholder UI; the timeline scrubber will be added
                  in a later step.
                </p>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Scenario</p>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="flex-1">
                      Best Case
                    </Button>
                    <Button variant="secondary" size="sm" className="flex-1">
                      Expected
                    </Button>
                    <Button variant="secondary" size="sm" className="flex-1">
                      Worst Case
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Horizon</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      6h
                    </Button>
                    <Button variant="outline" size="sm">
                      12h
                    </Button>
                    <Button variant="outline" size="sm">
                      24h
                    </Button>
                    <Button variant="outline" size="sm">
                      48h
                    </Button>
                  </div>
                </div>
                <div className="pt-2">
                  <Button
                    className="w-full"
                    onClick={() =>
                      toast({
                        title: "Forecast applied",
                        description: "Your forecast settings have been applied.",
                      })
                    }
                  >
                    Apply
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
