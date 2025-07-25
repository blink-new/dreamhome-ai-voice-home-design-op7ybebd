import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Send, Type } from 'lucide-react'

interface TextInputProps {
  onSubmit: (text: string) => void
  isProcessing: boolean
  language: string
}

export function TextInput({ onSubmit, isProcessing, language }: TextInputProps) {
  const [text, setText] = useState('')

  const handleSubmit = () => {
    if (text.trim() && !isProcessing) {
      onSubmit(text.trim())
      setText('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const placeholder = language === 'hi' 
    ? 'अपने सपनों के घर का विस्तार से वर्णन करें... जैसे: "मुझे 3 बेडरूम का घर चाहिए जिसमें एक बड़ा लिविंग रूम, आधुनिक रसोई और छोटा गार्डन हो।"'
    : 'Describe your dream home in detail... e.g., "I want a 3-bedroom house with a large living room, modern kitchen, and a small garden."'

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Type className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">
            {language === 'hi' ? 'टेक्स्ट में लिखें' : 'Type Your Description'}
          </h3>
        </div>
        
        <div className="space-y-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="min-h-32 resize-none"
            disabled={isProcessing}
          />
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {language === 'hi' 
                ? `${text.length} अक्षर • Enter दबाकर भेजें`
                : `${text.length} characters • Press Enter to send`
              }
            </p>
            
            <Button 
              onClick={handleSubmit}
              disabled={!text.trim() || isProcessing}
              className="space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>
                {language === 'hi' ? 'डिज़ाइन बनाएं' : 'Generate Design'}
              </span>
            </Button>
          </div>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium mb-2">
            {language === 'hi' ? 'सुझाव:' : 'Tips:'}
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• {language === 'hi' ? 'कमरों की संख्या बताएं (बेडरूम, बाथरूम)' : 'Mention number of rooms (bedrooms, bathrooms)'}</li>
            <li>• {language === 'hi' ? 'विशेष सुविधाएं जैसे गार्डन, बालकनी का उल्लेख करें' : 'Include special features like garden, balcony'}</li>
            <li>• {language === 'hi' ? 'घर का आकार या स्टाइल बताएं' : 'Describe house size or style preferences'}</li>
            <li>• {language === 'hi' ? 'जितना विस्तार से बताएंगे, उतना बेहतर डिज़ाइन मिलेगा' : 'More details = better design results'}</li>
          </ul>
        </div>
      </div>
    </Card>
  )
}