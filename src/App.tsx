import React, { useState, useEffect } from 'react'
import { createClient } from './blink/client'
import { VoiceRecorder } from './components/VoiceRecorder'
import { TextInput } from './components/TextInput'
import { DrawingCanvas } from './components/DrawingCanvas'
import { CodeInput } from './components/CodeInput'
import { FloorPlanCanvas } from './components/FloorPlanCanvas'
import { View3D } from './components/View3D'
import { LanguageSelector } from './components/LanguageSelector'
import { InputModeSelector, InputMode } from './components/InputModeSelector'
import { ViewToggle, ViewMode } from './components/ViewToggle'
import { Button } from './components/ui/button'
import { Card } from './components/ui/card'
import { Home, Sparkles, Zap, Users, Globe, Mic, Type, Pencil, Code, Box, Grid3X3 } from 'lucide-react'

const blink = createClient({
  projectId: 'dreamhome-ai-voice-home-design-op7ybebd',
  authRequired: true
})

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [inputMode, setInputMode] = useState<InputMode>('voice')
  const [viewMode, setViewMode] = useState<ViewMode>('2d')
  const [isProcessing, setIsProcessing] = useState(false)
  const [floorPlan, setFloorPlan] = useState(null)
  const [inputHistory, setInputHistory] = useState<Array<{type: string, content: string, timestamp: number}>>([])

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const handleInput = async (content: string, type: InputMode) => {
    setIsProcessing(true)
    
    // Add to history
    const newEntry = {
      type,
      content: type === 'drawing' ? 'Drawing sketch' : content,
      timestamp: Date.now()
    }
    setInputHistory(prev => [newEntry, ...prev.slice(0, 9)]) // Keep last 10 entries

    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Generate mock floor plan based on input
      const mockFloorPlan = {
        rooms: [
          { name: 'Living Room', width: 5, height: 4, x: 0, y: 0, color: '#3B82F6' },
          { name: 'Kitchen', width: 3, height: 3, x: 5, y: 0, color: '#10B981' },
          { name: 'Bedroom 1', width: 4, height: 4, x: 0, y: 4, color: '#8B5CF6' },
          { name: 'Bedroom 2', width: 3, height: 3, x: 4, y: 4, color: '#F59E0B' },
          { name: 'Bathroom', width: 2, height: 2, x: 7, y: 4, color: '#06B6D4' }
        ],
        doors: [
          { from: 'Living Room', to: 'Kitchen' },
          { from: 'Living Room', to: 'Bedroom 1' }
        ],
        windows: [
          { room: 'Living Room', wall: 'north', size: 2 },
          { room: 'Bedroom 1', wall: 'south', size: 1.5 }
        ],
        inputType: type,
        generatedAt: Date.now()
      }
      
      setFloorPlan(mockFloorPlan)
    } catch (error) {
      console.error('Error processing input:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-lg font-medium text-gray-800">Loading Voice2Home AI...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-6">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
              <Home className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Voice2Home AI</h1>
              <p className="text-gray-600 mt-2">Design your dream house by just speaking</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Mic className="w-4 h-4" />
                <span>Voice Input</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Box className="w-4 h-4" />
                <span>3D Models</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Globe className="w-4 h-4" />
                <span>Multi-Language</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Zap className="w-4 h-4" />
                <span>AI Powered</span>
              </div>
            </div>
            
            <Button 
              onClick={() => blink.auth.login()}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              Sign In to Start Designing
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Voice2Home AI</h1>
                <p className="text-sm text-gray-600">Multi-Modal Home Design Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSelector 
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
              />
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>Welcome, {user.email}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => blink.auth.logout()}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Input Mode Selector */}
            <InputModeSelector 
              activeMode={inputMode}
              onModeChange={setInputMode}
            />

            {/* Input Interface */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {inputMode === 'voice' && <Mic className="w-5 h-5 text-indigo-600" />}
                  {inputMode === 'text' && <Type className="w-5 h-5 text-indigo-600" />}
                  {inputMode === 'drawing' && <Pencil className="w-5 h-5 text-indigo-600" />}
                  {inputMode === 'code' && <Code className="w-5 h-5 text-indigo-600" />}
                  <h2 className="text-lg font-semibold text-gray-900">
                    {inputMode === 'voice' && (selectedLanguage === 'hi' ? 'आवाज़ से बताएं' : 'Voice Input')}
                    {inputMode === 'text' && (selectedLanguage === 'hi' ? 'टेक्स्ट में लिखें' : 'Text Input')}
                    {inputMode === 'drawing' && (selectedLanguage === 'hi' ? 'स्केच बनाएं' : 'Draw Your Plan')}
                    {inputMode === 'code' && (selectedLanguage === 'hi' ? 'कोड लिखें' : 'Code Input')}
                  </h2>
                </div>

                {inputMode === 'voice' && (
                  <VoiceRecorder 
                    onTranscription={(text) => handleInput(text, 'voice')}
                    selectedLanguage={selectedLanguage}
                    isProcessing={isProcessing}
                  />
                )}

                {inputMode === 'text' && (
                  <TextInput 
                    onTextSubmit={(text) => handleInput(text, 'text')}
                    selectedLanguage={selectedLanguage}
                  />
                )}

                {inputMode === 'drawing' && (
                  <DrawingCanvas 
                    onDrawingChange={(drawing) => drawing && handleInput(drawing, 'drawing')}
                  />
                )}

                {inputMode === 'code' && (
                  <CodeInput 
                    onCodeChange={(code) => code && handleInput(code, 'code')}
                  />
                )}
              </div>
            </Card>

            {/* Input History */}
            {inputHistory.length > 0 && (
              <Card className="p-4">
                <h3 className="font-medium text-gray-900 mb-3">
                  {selectedLanguage === 'hi' ? 'इनपुट हिस्ट्री' : 'Input History'}
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {inputHistory.map((entry, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 rounded text-sm">
                      {entry.type === 'voice' && <Mic className="w-4 h-4 text-indigo-600 mt-0.5" />}
                      {entry.type === 'text' && <Type className="w-4 h-4 text-indigo-600 mt-0.5" />}
                      {entry.type === 'drawing' && <Pencil className="w-4 h-4 text-indigo-600 mt-0.5" />}
                      {entry.type === 'code' && <Code className="w-4 h-4 text-indigo-600 mt-0.5" />}
                      <div className="flex-1">
                        <p className="text-gray-800 line-clamp-2">{entry.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(entry.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Output Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* View Toggle */}
            <ViewToggle 
              activeView={viewMode}
              onViewChange={setViewMode}
            />

            {/* Processing Status */}
            {isProcessing && (
              <Card className="p-6">
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <div className="text-center">
                    <p className="text-lg font-medium text-gray-800">
                      {selectedLanguage === 'hi' ? 'AI आपका घर डिज़ाइन कर रहा है...' : 'AI is designing your home...'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedLanguage === 'hi' ? 'कृपया प्रतीक्षा करें' : 'Please wait while we process your input'}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Floor Plan Display */}
            {floorPlan && !isProcessing && (
              <div className="space-y-6">
                {(viewMode === '2d' || viewMode === 'split') && (
                  <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Grid3X3 className="w-5 h-5 text-indigo-600" />
                      <h2 className="text-lg font-semibold text-gray-900">
                        {selectedLanguage === 'hi' ? '2D फ्लोर प्लान' : '2D Floor Plan'}
                      </h2>
                    </div>
                    <FloorPlanCanvas floorPlan={floorPlan} />
                  </Card>
                )}

                {(viewMode === '3d' || viewMode === 'split') && (
                  <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Box className="w-5 h-5 text-purple-600" />
                      <h2 className="text-lg font-semibold text-gray-900">
                        {selectedLanguage === 'hi' ? '3D मॉडल' : '3D Model'}
                      </h2>
                    </div>
                    <View3D floorPlan={floorPlan} />
                  </Card>
                )}
              </div>
            )}

            {/* Welcome Message */}
            {!floorPlan && !isProcessing && (
              <Card className="p-8 text-center">
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedLanguage === 'hi' ? 'Voice2Home AI में आपका स्वागत है!' : 'Welcome to Voice2Home AI!'}
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                      {selectedLanguage === 'hi' 
                        ? 'अपने सपनों के घर को डिज़ाइन करने के लिए आवाज़, टेक्स्ट, ड्राइंग या कोड का उपयोग करें। AI तुरंत आपके लिए 2D फ्लोर प्लान और 3D मॉडल बनाएगा।'
                        : 'Use voice, text, drawing, or code to design your dream home. AI will instantly generate 2D floor plans and 3D models for you.'
                      }
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                    {[
                      { icon: Mic, label: selectedLanguage === 'hi' ? 'आवाज़' : 'Voice', desc: selectedLanguage === 'hi' ? 'बोलकर बताएं' : 'Speak your vision' },
                      { icon: Type, label: selectedLanguage === 'hi' ? 'टेक्स्ट' : 'Text', desc: selectedLanguage === 'hi' ? 'लिखकर बताएं' : 'Type your ideas' },
                      { icon: Pencil, label: selectedLanguage === 'hi' ? 'ड्राइंग' : 'Drawing', desc: selectedLanguage === 'hi' ? 'स्केच बनाएं' : 'Sketch layout' },
                      { icon: Code, label: selectedLanguage === 'hi' ? 'कोड' : 'Code', desc: selectedLanguage === 'hi' ? 'JSON स्पेक' : 'JSON specs' }
                    ].map((mode, index) => {
                      const Icon = mode.icon
                      return (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer"
                             onClick={() => setInputMode(mode.label.toLowerCase() as InputMode)}>
                          <Icon className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                          <p className="font-medium text-gray-800 text-sm">{mode.label}</p>
                          <p className="text-xs text-gray-600">{mode.desc}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App