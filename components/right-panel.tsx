"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Line, LineChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip as RTooltip } from "recharts"
import { useMapLayers } from "@/components/map-layers-context"

const metricData = [
  { t: "T+0", v: 22 },
  { t: "T+2", v: 28 },
  { t: "T+4", v: 35 },
  { t: "T+6", v: 31 },
  { t: "T+8", v: 27 },
  { t: "T+10", v: 24 },
]

const alerts = [
  { id: "AL-1021", type: "Flood", severity: "High", area: "Mumbai Suburbs", time: "Now" },
  { id: "AL-1019", type: "Cyclone", severity: "Moderate", area: "Konkan Coast", time: "T-1h" },
  { id: "AL-1017", type: "Wind", severity: "Low", area: "Mumbai Port", time: "T-2h" },
]

export default function RightPanel() {
  const { flood, cyclone, wind } = useMapLayers()
  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="legend" className="flex-1 flex flex-col">
        <TabsList className="mx-3 mt-3">
          <TabsTrigger value="legend">Legend</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="alerts">
            Alerts
            <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded bg-amber-500/20 px-1 text-amber-400 text-xs">
              {alerts.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <Separator className="my-2" />

        <TabsContent value="legend" className="flex-1 overflow-auto p-3 pt-0">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Legend</h3>
              <ul className="space-y-3 text-sm">
                {flood && (
                  <li className="flex items-start gap-3">
                    <span className="h-3 w-3 rounded-full bg-cyan-400/80 mt-1" aria-hidden />
                    <div>
                      <div>
                        Flood zones <span className="ml-2 text-xs text-muted-foreground">(cyan fill)</span>
                      </div>
                    </div>
                  </li>
                )}
                {cyclone && (
                  <li className="flex items-start gap-3">
                    <span className="h-3 w-3 rounded-full bg-amber-400/80 mt-1" aria-hidden />
                    <div>
                      <div>
                        Cyclone best track{" "}
                        <span className="ml-2 text-xs text-muted-foreground">(amber line/points)</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Points show forecasted position every 6 hours.
                      </div>
                    </div>
                  </li>
                )}
                {wind && (
                  <li className="flex items-start gap-3">
                    <span
                      className="h-3 w-3 rotate-45 border-l-4 border-r-4 border-transparent border-b-8 border-b-amber-300 mt-0.5"
                      aria-hidden
                    />
                    <div>
                      <div>
                        Wind direction <span className="ml-2 text-xs text-muted-foreground">(amber arrow)</span>
                      </div>
                    </div>
                  </li>
                )}
                {!flood && !cyclone && !wind && (
                  <li className="text-xs text-muted-foreground">No data layers are active.</li>
                )}
              </ul>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="flex-1 overflow-auto p-3 pt-0">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Rainfall Intensity (mm) • Last 12h</h3>
            <div className="h-40 rounded-md border border-border/60 bg-secondary/20">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metricData} margin={{ top: 10, right: 16, bottom: 10, left: 0 }}>
                  <CartesianGrid stroke="hsl(var(--muted))" strokeOpacity={0.25} />
                  <XAxis
                    dataKey="t"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                  <RTooltip
                    contentStyle={{
                      background: "oklch(0.269 0 0)",
                      border: "1px solid oklch(0.269 0 0)",
                      color: "oklch(0.985 0 0)",
                    }}
                    labelStyle={{ color: "oklch(0.985 0 0)" }}
                  />
                  <Line type="monotone" dataKey="v" stroke="#22d3ee" strokeWidth={2} dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-muted-foreground">
              Data is illustrative and updates with live feeds in production.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="flex-1 overflow-auto p-3 pt-0">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Active Alerts</h3>
              <Badge className="bg-amber-500/20 text-amber-400" variant="secondary">
                {alerts.length} total
              </Badge>
            </div>
            <div className="rounded-md border border-border/60 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Area</TableHead>
                    <TableHead className="text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-mono text-xs">{a.id}</TableCell>
                      <TableCell>{a.type}</TableCell>
                      <TableCell>
                        <Badge className="bg-amber-500/20 text-amber-400" variant="secondary">
                          {a.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-pretty">{a.area}</TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">{a.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="text-xs text-muted-foreground">Alerts are mock data for demonstration purposes.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
