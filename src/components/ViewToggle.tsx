import React from 'react'
import { Button } from './ui/button'
import { Grid3X3, Box, Split } from 'lucide-react'

export type ViewMode = '2d' | '3d' | 'split'

interface ViewToggleProps {
  activeView: ViewMode
  onViewChange: (view: ViewMode) => void
}

export function ViewToggle({ activeView, onViewChange }: ViewToggleProps) {
  const views = [
    { id: '2d' as const, label: '2D Plan', icon: Grid3X3, description: 'Floor plan view' },
    { id: '3d' as const, label: '3D Model', icon: Box, description: 'Interactive 3D' },
    { id: 'split' as const, label: 'Split View', icon: Split, description: '2D + 3D together' }
  ]

  return (
    <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-gray-200 shadow-sm">
      {views.map((view) => {
        const Icon = view.icon
        const isActive = activeView === view.id
        
        return (
          <Button
            key={view.id}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange(view.id)}
            className={`flex items-center gap-2 transition-all duration-200 ${
              isActive 
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md' 
                : 'hover:bg-indigo-50 text-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            <div className="flex flex-col items-start">
              <span className="font-medium text-sm">{view.label}</span>
              <span className={`text-xs ${isActive ? 'text-indigo-100' : 'text-gray-500'}`}>
                {view.description}
              </span>
            </div>
          </Button>
        )
      })}
    </div>
  )
}