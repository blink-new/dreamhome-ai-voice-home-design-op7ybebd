import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react'

interface FloorPlanCanvasProps {
  transcription: string
  language: string
}

interface Room {
  id: string
  name: string
  x: number
  y: number
  width: number
  height: number
  type: 'bedroom' | 'living' | 'kitchen' | 'bathroom' | 'garden' | 'dining'
}

export function FloorPlanCanvas({ transcription, language }: FloorPlanCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [zoom, setZoom] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)

  const drawFloorPlan = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Set up scaling
    ctx.save()
    ctx.scale(zoom, zoom)

    // Draw background
    ctx.fillStyle = '#fafafa'
    ctx.fillRect(0, 0, canvas.width / zoom, canvas.height / zoom)

    // Draw grid
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 0.5
    for (let x = 0; x < canvas.width / zoom; x += 20) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height / zoom)
      ctx.stroke()
    }
    for (let y = 0; y < canvas.height / zoom; y += 20) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width / zoom, y)
      ctx.stroke()
    }

    // Room colors
    const roomColors = {
      bedroom: '#e0e7ff',
      living: '#fef3c7',
      kitchen: '#dcfce7',
      bathroom: '#fce7f3',
      garden: '#d1fae5',
      dining: '#fed7d7'
    }

    const roomBorders = {
      bedroom: '#6366f1',
      living: '#f59e0b',
      kitchen: '#10b981',
      bathroom: '#ec4899',
      garden: '#059669',
      dining: '#ef4444'
    }

    // Draw rooms
    rooms.forEach(room => {
      // Fill room
      ctx.fillStyle = roomColors[room.type]
      ctx.fillRect(room.x, room.y, room.width, room.height)

      // Draw room border
      ctx.strokeStyle = roomBorders[room.type]
      ctx.lineWidth = 2
      ctx.strokeRect(room.x, room.y, room.width, room.height)

      // Draw room label
      ctx.fillStyle = '#374151'
      ctx.font = '14px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      const centerX = room.x + room.width / 2
      const centerY = room.y + room.height / 2
      
      // Room name
      ctx.fillText(room.name, centerX, centerY - 8)
      
      // Room dimensions (in feet, approximate)
      const widthFt = Math.round(room.width / 10)
      const heightFt = Math.round(room.height / 10)
      ctx.font = '10px Inter, sans-serif'
      ctx.fillStyle = '#6b7280'
      ctx.fillText(`${widthFt}' × ${heightFt}'`, centerX, centerY + 8)
    })

    // Draw doors (simplified)
    ctx.strokeStyle = '#374151'
    ctx.lineWidth = 3
    
    // Main entrance
    ctx.beginPath()
    ctx.moveTo(150, 50)
    ctx.lineTo(150, 35)
    ctx.stroke()

    // Internal doors
    const doors = [
      { x: 250, y: 100, width: 20, vertical: false }, // Living to Kitchen
      { x: 190, y: 200, width: 20, vertical: false }, // Living to Bedroom 1
      { x: 350, y: 200, width: 20, vertical: false }, // Kitchen to Bedroom 2
    ]

    doors.forEach(door => {
      ctx.beginPath()
      if (door.vertical) {
        ctx.moveTo(door.x, door.y)
        ctx.lineTo(door.x, door.y + door.width)
      } else {
        ctx.moveTo(door.x, door.y)
        ctx.lineTo(door.x + door.width, door.y)
      }
      ctx.stroke()
    })

    ctx.restore()
  }, [rooms, zoom])

  const generateFloorPlan = useCallback(async () => {
    setIsGenerating(true)
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Generate rooms based on transcription
    // This is a simplified version - in reality, we'd use AI to parse the description
    const generatedRooms: Room[] = [
      { id: '1', name: 'Living Room', x: 50, y: 50, width: 200, height: 150, type: 'living' },
      { id: '2', name: 'Kitchen', x: 270, y: 50, width: 120, height: 100, type: 'kitchen' },
      { id: '3', name: 'Bedroom 1', x: 50, y: 220, width: 140, height: 120, type: 'bedroom' },
      { id: '4', name: 'Bedroom 2', x: 210, y: 220, width: 140, height: 120, type: 'bedroom' },
      { id: '5', name: 'Bedroom 3', x: 370, y: 220, width: 140, height: 120, type: 'bedroom' },
      { id: '6', name: 'Bathroom 1', x: 270, y: 170, width: 80, height: 80, type: 'bathroom' },
      { id: '7', name: 'Bathroom 2', x: 370, y: 170, width: 80, height: 80, type: 'bathroom' },
      { id: '8', name: 'Garden', x: 50, y: 360, width: 460, height: 80, type: 'garden' }
    ]
    
    setRooms(generatedRooms)
    setIsGenerating(false)
  }, [])

  useEffect(() => {
    if (transcription) {
      generateFloorPlan()
    }
  }, [transcription, generateFloorPlan])

  useEffect(() => {
    drawFloorPlan()
  }, [drawFloorPlan])

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 2))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5))
  }

  const handleReset = () => {
    setZoom(1)
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'floor-plan.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  if (!transcription) {
    return (
      <Card className="p-8 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-muted rounded-lg flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-muted-foreground border-dashed rounded" />
          </div>
          <h3 className="text-xl font-semibold">
            {language === 'hi' ? 'आपका फ्लोर प्लान यहां दिखेगा' : 'Your Floor Plan Will Appear Here'}
          </h3>
          <p className="text-muted-foreground">
            {language === 'hi' 
              ? 'अपने घर का वर्णन करने के बाद AI तुरंत 2D फ्लोर प्लान बनाएगा'
              : 'After describing your home, AI will instantly generate a 2D floor plan'
            }
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">
            {language === 'hi' ? 'आपका फ्लोर प्लान' : 'Your Floor Plan'}
          </h3>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button onClick={handleDownload} size="sm">
              <Download className="h-4 w-4 mr-2" />
              {language === 'hi' ? 'डाउनलोड' : 'Download'}
            </Button>
          </div>
        </div>

        {isGenerating ? (
          <div className="flex items-center justify-center h-96 bg-muted rounded-lg">
            <div className="text-center space-y-4">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-muted-foreground">
                {language === 'hi' ? 'AI फ्लोर प्लान बना रहा है...' : 'AI is generating floor plan...'}
              </p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={600}
              height={500}
              className="border rounded-lg bg-white w-full"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
        )}

        {rooms.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">
                {language === 'hi' ? 'कमरे' : 'Rooms'}
              </h4>
              <div className="space-y-1">
                {rooms.filter(r => r.type === 'bedroom').map(room => (
                  <div key={room.id} className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-indigo-200 border border-indigo-600 rounded-sm" />
                    <span>{room.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">
                {language === 'hi' ? 'रसोई और भोजन' : 'Kitchen & Dining'}
              </h4>
              <div className="space-y-1">
                {rooms.filter(r => ['kitchen', 'dining'].includes(r.type)).map(room => (
                  <div key={room.id} className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-sm ${room.type === 'kitchen' ? 'bg-green-200 border-green-600' : 'bg-red-200 border-red-600'} border`} />
                    <span>{room.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">
                {language === 'hi' ? 'बाथरूम' : 'Bathrooms'}
              </h4>
              <div className="space-y-1">
                {rooms.filter(r => r.type === 'bathroom').map(room => (
                  <div key={room.id} className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-pink-200 border border-pink-600 rounded-sm" />
                    <span>{room.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">
                {language === 'hi' ? 'अन्य' : 'Others'}
              </h4>
              <div className="space-y-1">
                {rooms.filter(r => ['living', 'garden'].includes(r.type)).map(room => (
                  <div key={room.id} className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-sm ${room.type === 'living' ? 'bg-yellow-200 border-yellow-600' : 'bg-green-200 border-green-600'} border`} />
                    <span>{room.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}