import React, { useState, useEffect } from 'react'
import { blink } from './blink/client'
import { VoiceRecorder } from './components/VoiceRecorder'
import { FloorPlanCanvas } from './components/FloorPlanCanvas'
import { LanguageSelector } from './components/LanguageSelector'
import { TextInput } from './components/TextInput'
import { Card } from './components/ui/card'
import { Button } from './components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Home, Mic, Type, User, LogOut } from 'lucide-react'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [language, setLanguage] = useState('hi')
  const [transcription, setTranscription] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [inputMethod, setInputMethod] = useState<'voice' | 'text'>('voice')

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const handleTranscription = (text: string) => {
    setTranscription(text)
    setIsProcessing(false)
  }

  const handleTextSubmit = (text: string) => {
    setIsProcessing(true)
    // Simulate processing time
    setTimeout(() => {
      setTranscription(text)
      setIsProcessing(false)
    }, 1000)
  }

  const handleVoiceStart = () => {
    setIsProcessing(true)
  }

  const handleLogout = () => {
    blink.auth.logout()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading DreamHome.AI...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-6">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary rounded-2xl flex items-center justify-center">
              <Home className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">DreamHome.AI</h1>
              <p className="text-muted-foreground mt-2">
                Design your dream house with just your voice
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Describe your ideal home in Hindi or any local language and watch AI create a 2D floor plan instantly.
            </p>
            <Button onClick={() => blink.auth.login()} className="w-full" size="lg">
              Get Started
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Home className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">DreamHome.AI</h1>
                <p className="text-xs text-muted-foreground">Voice-Powered Home Design</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{user.email}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Input */}
          <div className="space-y-6">
            {/* Language Selector */}
            <LanguageSelector 
              language={language} 
              onLanguageChange={setLanguage} 
            />

            {/* Input Method Tabs */}
            <Tabs value={inputMethod} onValueChange={(value) => setInputMethod(value as 'voice' | 'text')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="voice" className="space-x-2">
                  <Mic className="h-4 w-4" />
                  <span>{language === 'hi' ? 'आवाज़' : 'Voice'}</span>
                </TabsTrigger>
                <TabsTrigger value="text" className="space-x-2">
                  <Type className="h-4 w-4" />
                  <span>{language === 'hi' ? 'टेक्स्ट' : 'Text'}</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="voice" className="mt-6">
                <VoiceRecorder
                  onTranscription={handleTranscription}
                  isProcessing={isProcessing}
                  language={language}
                />
              </TabsContent>
              
              <TabsContent value="text" className="mt-6">
                <TextInput
                  onSubmit={handleTextSubmit}
                  isProcessing={isProcessing}
                  language={language}
                />
              </TabsContent>
            </Tabs>

            {/* Transcription Display */}
            {transcription && (
              <Card className="p-4">
                <h4 className="font-medium mb-2">
                  {language === 'hi' ? 'आपका विवरण:' : 'Your Description:'}
                </h4>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                  {transcription}
                </p>
              </Card>
            )}
          </div>

          {/* Right Panel - Floor Plan */}
          <div className="space-y-6">
            <FloorPlanCanvas 
              transcription={transcription} 
              language={language} 
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <div className="w-12 h-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Mic className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">
              {language === 'hi' ? 'आवाज़ से डिज़ाइन' : 'Voice-Powered Design'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === 'hi' 
                ? 'हिंदी या किसी भी स्थानीय भाषा में बोलें और तुरंत फ्लोर प्लान पाएं'
                : 'Speak in Hindi or any local language and get instant floor plans'
              }
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 mx-auto bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <Home className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">
              {language === 'hi' ? 'AI-संचालित' : 'AI-Powered'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === 'hi' 
                ? 'उन्नत AI तकनीक आपके विवरण को समझकर सटीक डिज़ाइन बनाती है'
                : 'Advanced AI understands your description and creates accurate designs'
              }
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 mx-auto bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Type className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">
              {language === 'hi' ? 'आसान उपयोग' : 'Easy to Use'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {language === 'hi' 
                ? 'कोई आर्किटेक्ट की जरूरत नहीं। बस बोलें और अपना घर देखें'
                : 'No architect needed. Just speak and see your home come to life'
              }
            </p>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default App