import React from 'react'
import { Button } from './ui/button'
import { Mic, Type, Pencil, Code, Palette } from 'lucide-react'

export type InputMode = 'voice' | 'text' | 'drawing' | 'code'

interface InputModeSelectorProps {
  activeMode: InputMode
  onModeChange: (mode: InputMode) => void
}

const modes = [
  { id: 'voice' as const, label: 'Voice', icon: Mic, description: 'Speak your vision' },
  { id: 'text' as const, label: 'Text', icon: Type, description: 'Type your ideas' },
  { id: 'drawing' as const, label: 'Draw', icon: Pencil, description: 'Sketch your layout' },
  { id: 'code' as const, label: 'Code', icon: Code, description: 'Technical specs' }
]

export function InputModeSelector({ activeMode, onModeChange }: InputModeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2 w-full">
        <Palette className="w-4 h-4" />
        <span className="font-medium">Choose your input method:</span>
      </div>
      
      {modes.map((mode) => {
        const Icon = mode.icon
        const isActive = activeMode === mode.id
        
        return (
          <Button
            key={mode.id}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => onModeChange(mode.id)}
            className={`flex items-center gap-2 transition-all duration-200 ${
              isActive 
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md' 
                : 'hover:bg-indigo-50 hover:border-indigo-300'
            }`}
          >
            <Icon className="w-4 h-4" />
            <div className="flex flex-col items-start">
              <span className="font-medium">{mode.label}</span>
              <span className={`text-xs ${isActive ? 'text-indigo-100' : 'text-gray-500'}`}>
                {mode.description}
              </span>
            </div>
          </Button>
        )
      })}
    </div>
  )
}