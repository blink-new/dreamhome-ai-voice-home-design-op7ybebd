import React, { useRef, useEffect, useState } from 'react'
import { Button } from './ui/button'
import { RotateCcw, ZoomIn, ZoomOut, Move3D, Download, Eye } from 'lucide-react'

interface View3DProps {
  floorPlan: any
}

export function View3D({ floorPlan }: View3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'perspective' | 'top' | 'side'>('perspective')

  useEffect(() => {
    // Simulate 3D rendering loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [floorPlan])

  const resetView = () => {
    // Reset 3D view to default position
    console.log('Resetting 3D view')
  }

  const downloadModel = () => {
    // Download 3D model
    console.log('Downloading 3D model')
  }

  const switchViewMode = (mode: 'perspective' | 'top' | 'side') => {
    setViewMode(mode)
  }

  return (
    <div className="space-y-4">
      {/* 3D Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
        <div className="flex items-center gap-2">
          <Move3D className="w-5 h-5 text-purple-600" />
          <span className="font-medium text-purple-900">3D View Controls</span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Mode Buttons */}
          <div className="flex gap-1 bg-white rounded-lg p-1 border">
            {[
              { mode: 'perspective' as const, label: '3D', icon: Move3D },
              { mode: 'top' as const, label: 'Top', icon: Eye },
              { mode: 'side' as const, label: 'Side', icon: Eye }
            ].map(({ mode, label, icon: Icon }) => (
              <Button
                key={mode}
                variant={viewMode === mode ? "default" : "ghost"}
                size="sm"
                onClick={() => switchViewMode(mode)}
                className={`px-3 ${
                  viewMode === mode 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                    : 'hover:bg-purple-100'
                }`}
              >
                <Icon className="w-4 h-4 mr-1" />
                {label}
              </Button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetView}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={downloadModel}>
              <Download className="w-4 h-4 mr-1" />
              Export 3D
            </Button>
          </div>
        </div>
      </div>

      {/* 3D Viewport */}
      <div 
        ref={containerRef}
        className="relative w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl border-2 border-gray-300 overflow-hidden"
      >
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-800">Generating 3D Model...</p>
                <p className="text-sm text-gray-600">Creating walls, rooms, and textures</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0">
            {/* Mock 3D Scene */}
            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
              {/* Floor Grid */}
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full">
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#6366F1" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Mock 3D Rooms */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative transform-gpu" style={{ 
                  transform: viewMode === 'perspective' ? 'perspective(800px) rotateX(45deg) rotateY(15deg)' :
                            viewMode === 'top' ? 'perspective(800px) rotateX(90deg)' :
                            'perspective(800px) rotateY(90deg)'
                }}>
                  {/* Living Room */}
                  <div className="absolute w-32 h-24 bg-gradient-to-br from-blue-200 to-blue-300 border-2 border-blue-400 rounded-lg shadow-lg transform translate-z-0">
                    <div className="absolute inset-2 bg-blue-100/50 rounded border border-blue-300"></div>
                    <div className="absolute bottom-1 left-1 text-xs font-medium text-blue-800">Living Room</div>
                  </div>

                  {/* Kitchen */}
                  <div className="absolute w-20 h-20 bg-gradient-to-br from-green-200 to-green-300 border-2 border-green-400 rounded-lg shadow-lg transform translate-x-32 translate-z-0">
                    <div className="absolute inset-2 bg-green-100/50 rounded border border-green-300"></div>
                    <div className="absolute bottom-1 left-1 text-xs font-medium text-green-800">Kitchen</div>
                  </div>

                  {/* Bedroom */}
                  <div className="absolute w-24 h-20 bg-gradient-to-br from-purple-200 to-purple-300 border-2 border-purple-400 rounded-lg shadow-lg transform translate-y-24 translate-z-0">
                    <div className="absolute inset-2 bg-purple-100/50 rounded border border-purple-300"></div>
                    <div className="absolute bottom-1 left-1 text-xs font-medium text-purple-800">Bedroom</div>
                  </div>

                  {/* Bathroom */}
                  <div className="absolute w-16 h-16 bg-gradient-to-br from-cyan-200 to-cyan-300 border-2 border-cyan-400 rounded-lg shadow-lg transform translate-x-24 translate-y-24 translate-z-0">
                    <div className="absolute inset-2 bg-cyan-100/50 rounded border border-cyan-300"></div>
                    <div className="absolute bottom-1 left-1 text-xs font-medium text-cyan-800">Bath</div>
                  </div>
                </div>
              </div>

              {/* 3D Scene Info */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <Move3D className="w-4 h-4" />
                  <span className="font-medium">Interactive 3D Model</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  View: {viewMode === 'perspective' ? '3D Perspective' : viewMode === 'top' ? 'Top View' : 'Side View'}
                </p>
              </div>

              {/* Navigation Hint */}
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-2 rounded-lg text-xs">
                🖱️ Click & drag to rotate • 🔍 Scroll to zoom
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3D Features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        {[
          { icon: Move3D, label: 'Interactive', desc: 'Rotate & zoom' },
          { icon: Eye, label: 'Multi-view', desc: 'Different angles' },
          { icon: Download, label: 'Export', desc: 'Save as 3D file' },
          { icon: ZoomIn, label: 'Details', desc: 'High resolution' }
        ].map((feature, index) => {
          const Icon = feature.icon
          return (
            <div key={index} className="p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors">
              <Icon className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="font-medium text-gray-800 text-sm">{feature.label}</p>
              <p className="text-xs text-gray-600">{feature.desc}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}