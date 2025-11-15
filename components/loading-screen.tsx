"use client"

import React from "react"
import { Loader2, MapPin, Zap, Shield, AlertTriangle } from "lucide-react"

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        {/* Project INDRA Logo/Title */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
            <Shield className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Project INDRA</h1>
          <p className="text-muted-foreground">Disaster Management Platform</p>
        </div>

        {/* Loading Animation */}
        <div className="mb-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <div className="text-lg font-medium text-foreground mb-2">Initializing Control Panel</div>
          <div className="text-sm text-muted-foreground">Loading disaster monitoring systems...</div>
        </div>

        {/* Loading Steps */}
        <div className="space-y-3 text-left">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-muted-foreground">Connecting to satellite feeds</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
            <span className="text-muted-foreground">Initializing hazard overlays</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
            <span className="text-muted-foreground">Loading alert systems</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.6s" }}></div>
            <span className="text-muted-foreground">Establishing emergency protocols</span>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="mt-8 flex justify-center gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>Mumbai, India</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Zap className="h-4 w-4" />
            <span>Real-time</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <AlertTriangle className="h-4 w-4" />
            <span>4 Hazards</span>
          </div>
        </div>
      </div>
    </div>
  )
}