"use client"

import React from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Line, LineChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip as RTooltip } from "recharts"
import { useMapLayers } from "@/components/map-layers-context"
import { useTimeline } from "@/components/timeline-context"

const metricData = [
  { t: "T+0", v: 22 },
  { t: "T+2", v: 28 },
  { t: "T+4", v: 35 },
  { t: "T+6", v: 31 },
  { t: "T+8", v: 27 },
  { t: "T+10", v: 24 },
]

// Severity: green (Safe), yellow (Watch), orange (Warning), red (Severe)
const alerts = [
  { id: "AL-1021", type: "Flood", severity: "Severe", color: "red", area: "Mumbai Suburbs", time: "Now" },
  { id: "AL-1019", type: "Cyclone", severity: "Warning", color: "orange", area: "Konkan Coast", time: "T-1h" },
  { id: "AL-1018", type: "Heatwave", severity: "Watch", color: "yellow", area: "Thane", time: "T-2h" },
  { id: "AL-1017", type: "Wind", severity: "Safe", color: "green", area: "Mumbai Port", time: "T-3h" },
]

export default function RightPanel() {
  const { flood, cyclone, wind, landslide, heat } = useMapLayers()
  const { step } = useTimeline()
  // Dummy dynamic values based on timeline step
  const floodPop = 120000 + step * 500
  const landslidePop = 18500 + step * 120
  const cyclonePop = 95000 + step * 400
  const heatPop = 210000 + step * 800
  const getPriority = (base: number) => {
    // Returns [high, medium, low] zone counts (dummy logic)
    return [base + (step % 3), base + 1 + (step % 2), base + 2 - (step % 2)]
  }
  return (
    <div className="h-full flex flex-col overflow-auto p-3 space-y-6">
                        {/* Metrics Section */}
                        <section>
                          <h3 className="text-sm font-medium mb-2">Rainfall Intensity (mm) • Last 12h</h3>
                          <div className="h-40 rounded-md border border-border/60 bg-secondary/20 mb-2">
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
                                    border: "1px solid oklch(0.269 0 0)",
                                    color: "oklch(0.985 0 0)",
                                  }}
                                  labelStyle={{ color: "oklch(0.985 0 0)" }}
                                />
                                <Line type="monotone" dataKey="v" stroke="#22d3ee" strokeWidth={2} dot={{ r: 2 }} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                          {/* <p className="text-xs text-muted-foreground">
                            Data is illustrative and updates with live feeds in production.
                          </p> */}
                        </section>
                        <Separator className="my-2" />
                        {/* Alerts Section */}
                        <section>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium">Active Alerts</h3>
                            <Badge className="bg-amber-500/20 text-amber-400" variant="secondary">
                              {alerts.length} total
                            </Badge>
                          </div>
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
                                    <Badge
                                      className={
                                        a.color === "red"
                                          ? "bg-red-500/20 text-red-700 dark:text-red-400"
                                          : a.color === "orange"
                                          ? "bg-orange-500/20 text-orange-700 dark:text-orange-400"
                                          : a.color === "yellow"
                                          ? "bg-yellow-400/20 text-yellow-700 dark:text-yellow-300"
                                          : a.color === "green"
                                          ? "bg-green-400/20 text-green-700 dark:text-green-300"
                                          : ""
                                      }
                                      variant="secondary"
                                    >
                                      {a.severity}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-pretty">{a.area}</TableCell>
                                  <TableCell className="text-right text-xs text-muted-foreground">{a.time}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          <p className="text-xs text-muted-foreground mt-2">
                            Severity: <span className="font-semibold text-green-600">Safe</span> (green),
                            <span className="font-semibold text-yellow-600 ml-1">Watch</span> (yellow),
                            <span className="font-semibold text-orange-600 ml-1">Warning</span> (orange),
                            <span className="font-semibold text-red-600 ml-1">Severe</span> (red)
                          </p>
                          {/* <p className="text-xs text-muted-foreground">Alerts are mock data for demonstration purposes.</p> */}
                        </section>
                        <Separator className="my-2" />
                        {/* Emergency Response Section */}
                        <section>
                          <h3 className="text-sm font-medium mb-2">Emergency Response</h3>
                          {flood && (
                            <div className="mb-4">
                              <h4 className="font-semibold text-cyan-600">Flood</h4>
                              <div className="text-xs text-muted-foreground mb-1">Affected Population: <span className="font-bold text-cyan-700">{floodPop.toLocaleString()}</span></div>
                              <div className="flex gap-2 text-xs">
                                <Badge className="bg-red-500/20 text-red-700">High ({getPriority(3)[0]})</Badge>
                                <Badge className="bg-orange-500/20 text-orange-700">Medium ({getPriority(3)[1]})</Badge>
                                <Badge className="bg-yellow-400/20 text-yellow-700">Low ({getPriority(3)[2]})</Badge>
                              </div>
                              <div className="mt-1 text-xs text-muted-foreground">Evacuate high risk zones. Mobilize rescue teams.</div>
                            </div>
                          )}
                          {landslide && (
                            <div className="mb-4">
                              <h4 className="font-semibold text-amber-700">Landslide</h4>
                              <div className="text-xs text-muted-foreground mb-1">Affected Population: <span className="font-bold text-amber-800">{landslidePop.toLocaleString()}</span></div>
                              <div className="flex gap-2 text-xs">
                                <Badge className="bg-red-500/20 text-red-700">High ({getPriority(1)[0]})</Badge>
                                <Badge className="bg-orange-500/20 text-orange-700">Medium ({getPriority(1)[1]})</Badge>
                                <Badge className="bg-yellow-400/20 text-yellow-700">Low ({getPriority(1)[2]})</Badge>
                              </div>
                              <div className="mt-1 text-xs text-muted-foreground">Alert local authorities. Monitor slopes and rainfall.</div>
                            </div>
                          )}
                          {cyclone && (
                            <div className="mb-4">
                              <h4 className="font-semibold text-amber-600">Cyclone</h4>
                              <div className="text-xs text-muted-foreground mb-1">Affected Population: <span className="font-bold text-amber-700">{cyclonePop.toLocaleString()}</span></div>
                              <div className="flex gap-2 text-xs">
                                <Badge className="bg-red-500/20 text-red-700">High ({getPriority(2)[0]})</Badge>
                                <Badge className="bg-orange-500/20 text-orange-700">Medium ({getPriority(2)[1]})</Badge>
                                <Badge className="bg-yellow-400/20 text-yellow-700">Low ({getPriority(2)[2]})</Badge>
                              </div>
                              <div className="mt-1 text-xs text-muted-foreground">Issue evacuation orders. Secure infrastructure.</div>
                            </div>
                          )}
                          {heat && (
                            <div className="mb-4">
                              <h4 className="font-semibold text-red-600">Heatwave</h4>
                              <div className="text-xs text-muted-foreground mb-1">Affected Population: <span className="font-bold text-red-700">{heatPop.toLocaleString()}</span></div>
                              <div className="flex gap-2 text-xs">
                                <Badge className="bg-red-500/20 text-red-700">High ({getPriority(4)[0]})</Badge>
                                <Badge className="bg-orange-500/20 text-orange-700">Medium ({getPriority(4)[1]})</Badge>
                                <Badge className="bg-yellow-400/20 text-yellow-700">Low ({getPriority(4)[2]})</Badge>
                              </div>
                              <div className="mt-1 text-xs text-muted-foreground">Distribute water. Open cooling centers. Advise public to stay indoors.</div>
                            </div>
                          )}
                          {!flood && !landslide && !cyclone && !heat && (
                            <div className="text-xs text-muted-foreground">No active hazards for response.</div>
                          )}
                        </section>
                      </div>
                    )
                  }
