import React, { useState } from 'react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Play, Copy, RotateCcw, Code2, Lightbulb } from 'lucide-react'

interface CodeInputProps {
  onCodeChange: (code: string) => void
}

const codeExamples = [
  {
    title: "Simple 2BHK",
    code: `{
  "rooms": [
    {"name": "Living Room", "width": 4, "height": 5, "x": 0, "y": 0},
    {"name": "Kitchen", "width": 3, "height": 3, "x": 4, "y": 0},
    {"name": "Bedroom 1", "width": 4, "height": 4, "x": 0, "y": 5},
    {"name": "Bedroom 2", "width": 3, "height": 4, "x": 4, "y": 3},
    {"name": "Bathroom", "width": 2, "height": 2, "x": 7, "y": 3}
  ],
  "doors": [
    {"from": "Living Room", "to": "Kitchen"},
    {"from": "Living Room", "to": "Bedroom 1"},
    {"from": "Kitchen", "to": "Bedroom 2"}
  ],
  "windows": [
    {"room": "Living Room", "wall": "north", "size": 2},
    {"room": "Bedroom 1", "wall": "south", "size": 1.5}
  ]
}`
  },
  {
    title: "Villa Layout",
    code: `{
  "floors": [
    {
      "level": "Ground Floor",
      "rooms": [
        {"name": "Entrance Hall", "width": 3, "height": 2},
        {"name": "Living Room", "width": 6, "height": 5},
        {"name": "Dining Room", "width": 4, "height": 4},
        {"name": "Kitchen", "width": 4, "height": 3},
        {"name": "Guest Bedroom", "width": 4, "height": 4},
        {"name": "Guest Bathroom", "width": 2, "height": 2}
      ]
    }
  ],
  "features": ["garden", "parking", "balcony"]
}`
  }
]

export function CodeInput({ onCodeChange }: CodeInputProps) {
  const [code, setCode] = useState('')
  const [selectedExample, setSelectedExample] = useState<number | null>(null)

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
    onCodeChange(newCode)
  }

  const loadExample = (exampleCode: string, index: number) => {
    setCode(exampleCode)
    setSelectedExample(index)
    onCodeChange(exampleCode)
  }

  const clearCode = () => {
    setCode('')
    setSelectedExample(null)
    onCodeChange('')
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
  }

  const formatCode = () => {
    try {
      const parsed = JSON.parse(code)
      const formatted = JSON.stringify(parsed, null, 2)
      setCode(formatted)
      onCodeChange(formatted)
    } catch (error) {
      // If not valid JSON, just keep as is
    }
  }

  return (
    <div className="space-y-4">
      {/* Code Examples */}
      <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-4 h-4 text-indigo-600" />
          <span className="font-medium text-indigo-900">Quick Start Examples:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {codeExamples.map((example, index) => (
            <Button
              key={index}
              variant={selectedExample === index ? "default" : "outline"}
              size="sm"
              onClick={() => loadExample(example.code, index)}
              className={`justify-start ${
                selectedExample === index 
                  ? 'bg-indigo-600 hover:bg-indigo-700' 
                  : 'hover:bg-indigo-100 border-indigo-300'
              }`}
            >
              <Code2 className="w-4 h-4 mr-2" />
              {example.title}
            </Button>
          ))}
        </div>
      </div>

      {/* Code Editor */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Code2 className="w-4 h-4" />
            JSON Floor Plan Specification
          </label>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={formatCode} disabled={!code}>
              <Play className="w-4 h-4 mr-1" />
              Format
            </Button>
            <Button variant="outline" size="sm" onClick={copyCode} disabled={!code}>
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={clearCode} disabled={!code}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>

        <Textarea
          value={code}
          onChange={(e) => handleCodeChange(e.target.value)}
          placeholder={`Enter your floor plan as JSON code...

Example:
{
  "rooms": [
    {"name": "Living Room", "width": 4, "height": 5},
    {"name": "Kitchen", "width": 3, "height": 3}
  ],
  "doors": [{"from": "Living Room", "to": "Kitchen"}]
}`}
          className="min-h-[300px] font-mono text-sm resize-none"
        />
      </div>

      {/* Code Validation */}
      {code && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            {(() => {
              try {
                JSON.parse(code)
                return (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-700 font-medium">Valid JSON ✓</span>
                  </>
                )
              } catch (error) {
                return (
                  <>
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-red-700 font-medium">Invalid JSON - Please check syntax</span>
                  </>
                )
              }
            })()}
          </div>
        </div>
      )}
    </div>
  )
}