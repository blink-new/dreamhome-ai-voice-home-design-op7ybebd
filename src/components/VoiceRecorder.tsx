import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Mic, Square, Play, Pause } from 'lucide-react'

interface VoiceRecorderProps {
  onTranscription: (text: string) => void
  isProcessing: boolean
  language: string
}

export function VoiceRecorder({ onTranscription, isProcessing, language }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [recordingTime, setRecordingTime] = useState(0)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      if (audioContextRef.current) audioContextRef.current.close()
    }
  }, [])

  const monitorAudioLevel = () => {
    if (analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
      analyserRef.current.getByteFrequencyData(dataArray)
      
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length
      setAudioLevel(average / 255)
      
      animationRef.current = requestAnimationFrame(monitorAudioLevel)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      // Set up audio context for visualization
      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)
      analyserRef.current.fftSize = 256
      
      // Set up media recorder
      mediaRecorderRef.current = new MediaRecorder(stream)
      chunksRef.current = []
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }
      
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' })
        setAudioBlob(audioBlob)
        
        // Convert to base64 and transcribe
        const reader = new FileReader()
        reader.onload = async () => {
          const dataUrl = reader.result as string
          const base64Data = dataUrl.split(',')[1]
          
          try {
            // Here we would use Blink SDK to transcribe
            // For now, simulate transcription
            setTimeout(() => {
              onTranscription("मैं एक 3 बेडरूम का घर चाहता हूं जिसमें एक बड़ा लिविंग रूम, रसोई और 2 बाथरूम हों। घर में एक छोटा गार्डन भी होना चाहिए।")
            }, 2000)
          } catch (error) {
            console.error('Transcription failed:', error)
          }
        }
        reader.readAsDataURL(audioBlob)
        
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingTime(0)
      
      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
      
      // Start audio level monitoring
      monitorAudioLevel()
      
    } catch (error) {
      console.error('Error starting recording:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close()
        audioContextRef.current = null
      }
    }
  }

  const playRecording = () => {
    if (audioBlob && !isPlaying) {
      const audioUrl = URL.createObjectURL(audioBlob)
      audioRef.current = new Audio(audioUrl)
      audioRef.current.play()
      setIsPlaying(true)
      
      audioRef.current.onended = () => {
        setIsPlaying(false)
        URL.revokeObjectURL(audioUrl)
      }
    }
  }

  const pausePlayback = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card className="p-8 text-center space-y-6">
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-foreground">
          {language === 'hi' ? 'अपने सपनों के घर का वर्णन करें' : 'Describe Your Dream Home'}
        </h3>
        <p className="text-muted-foreground">
          {language === 'hi' 
            ? 'माइक बटन दबाएं और अपने आदर्श घर के बारे में बताएं'
            : 'Press the mic button and tell us about your ideal home'
          }
        </p>
      </div>

      {/* Audio Visualization */}
      <div className="flex justify-center items-center h-24">
        {isRecording ? (
          <div className="flex items-center space-x-2">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="bg-primary rounded-full transition-all duration-100"
                style={{
                  width: '4px',
                  height: `${Math.max(8, audioLevel * 60 + Math.random() * 20)}px`,
                  opacity: 0.3 + audioLevel * 0.7
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-2 bg-muted rounded-full"
              />
            ))}
          </div>
        )}
      </div>

      {/* Recording Controls */}
      <div className="flex justify-center items-center space-x-4">
        {!isRecording ? (
          <Button
            onClick={startRecording}
            disabled={isProcessing}
            size="lg"
            className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90"
          >
            <Mic className="h-6 w-6" />
          </Button>
        ) : (
          <Button
            onClick={stopRecording}
            size="lg"
            variant="destructive"
            className="h-16 w-16 rounded-full"
          >
            <Square className="h-6 w-6" />
          </Button>
        )}

        {audioBlob && !isRecording && (
          <Button
            onClick={isPlaying ? pausePlayback : playRecording}
            variant="outline"
            size="lg"
            className="h-12 w-12 rounded-full"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {/* Recording Status */}
      {isRecording && (
        <div className="flex items-center justify-center space-x-2 text-primary">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <span className="font-medium">
            {language === 'hi' ? 'रिकॉर्डिंग...' : 'Recording...'} {formatTime(recordingTime)}
          </span>
        </div>
      )}

      {isProcessing && (
        <div className="flex items-center justify-center space-x-2 text-primary">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="font-medium">
            {language === 'hi' ? 'AI आपके घर का डिज़ाइन बना रहा है...' : 'AI is designing your home...'}
          </span>
        </div>
      )}
    </Card>
  )
}