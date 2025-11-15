"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  MapPin, 
  AlertTriangle, 
  Waves, 
  Wind, 
  Thermometer, 
  Mountain, 
  Shield, 
  Clock, 
  Users, 
  BarChart3,
  Eye,
  Zap
} from "lucide-react"

interface LandingPageProps {
  onEnterDashboard: () => void
}

export default function LandingPage({ onEnterDashboard }: LandingPageProps) {
  const features = [
    {
      icon: <Waves className="h-8 w-8 text-cyan-500" />,
      title: "Flood Monitoring",
      description: "Real-time flood risk zones with dynamic water level tracking and affected area visualization.",
      capabilities: ["Water level sensors", "Inundation mapping", "Population at risk"]
    },
    {
      icon: <Wind className="h-8 w-8 text-amber-500" />,
      title: "Cyclone Tracking",
      description: "Advanced cyclone forecast with animated storm tracks and cone of uncertainty projections.",
      capabilities: ["Storm path prediction", "Wind speed analysis", "Landfall estimation"]
    },
    {
      icon: <Thermometer className="h-8 w-8 text-red-500" />,
      title: "Heatwave Detection",
      description: "Temperature monitoring with heatwave intensity mapping and vulnerable population alerts.",
      capabilities: ["Temperature grids", "Heat index calculation", "Health advisories"]
    },
    {
      icon: <Mountain className="h-8 w-8 text-yellow-600" />,
      title: "Landslide Assessment",
      description: "Slope stability analysis with susceptibility mapping based on rainfall and terrain data.",
      capabilities: ["Slope monitoring", "Rainfall correlation", "Risk zonation"]
    }
  ]

  const capabilities = [
    {
      icon: <Eye className="h-6 w-6 text-blue-500" />,
      title: "Dynamic Overlays",
      description: "Toggle between different hazard layers with real-time data visualization"
    },
    {
      icon: <AlertTriangle className="h-6 w-6 text-orange-500" />,
      title: "Alert System",
      description: "Multi-level severity alerts with automated notifications and escalation"
    },
    {
      icon: <Clock className="h-6 w-6 text-purple-500" />,
      title: "Timeline Control",
      description: "Scrub through time to visualize hazard evolution and forecast scenarios"
    },
    {
      icon: <Users className="h-6 w-6 text-green-500" />,
      title: "Emergency Response",
      description: "Population impact analysis with resource deployment recommendations"
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-indigo-500" />,
      title: "Analytics Dashboard",
      description: "Real-time metrics, rainfall intensity charts, and trend analysis"
    },
    {
      icon: <Shield className="h-6 w-6 text-teal-500" />,
      title: "Multi-Basemap Support",
      description: "Switch between dark, light, and satellite imagery for optimal visualization"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-grid-white/[0.02] dark:bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          <div className="text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Zap className="h-3 w-3 mr-1" />
              Advanced Disaster Management Platform
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Project
              <br />
              <span className="text-primary">
                INDRA
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Advanced real-time monitoring and visualization platform for floods, cyclones, heatwaves, 
              and landslides with integrated alert systems and emergency response coordination.
            </p>
            <div className="flex justify-center">
              <Button 
                onClick={onEnterDashboard}
                size="lg" 
                className="px-12 py-4 text-xl"
              >
                <MapPin className="h-6 w-6 mr-3" />
                Enter Control Panel
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hazard Modules Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Comprehensive Hazard Coverage
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Monitor multiple disaster types simultaneously with advanced forecasting and real-time data integration.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:bg-accent/50 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  {feature.icon}
                  <div>
                    <CardTitle className="text-foreground">{feature.title}</CardTitle>
                  </div>
                </div>
                <CardDescription className="text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {feature.capabilities.map((capability, idx) => (
                    <Badge key={idx} variant="secondary">
                      {capability}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Platform Capabilities Section */}
      <div className="bg-accent/30 border-y py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Advanced Platform Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built with cutting-edge technology to provide actionable insights for disaster management professionals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {capabilities.map((capability, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-4">
                  {capability.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{capability.title}</h3>
                <p className="text-muted-foreground text-sm">{capability.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">4+</div>
            <div className="text-muted-foreground">Hazard Types</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">Real-time</div>
            <div className="text-muted-foreground">Data Updates</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">Multi-level</div>
            <div className="text-muted-foreground">Alert System</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">360°</div>
            <div className="text-muted-foreground">Situational Awareness</div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-accent border-t py-12">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Ready to Transform Disaster Management?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Access the full control panel to monitor, analyze, and respond to natural disasters in real-time.
          </p>
          <Button 
            onClick={onEnterDashboard}
            size="lg" 
            className="px-8 py-3 text-lg"
          >
            <Shield className="h-5 w-5 mr-2" />
            Launch Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}