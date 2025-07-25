import React, { useState } from 'react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Send, Lightbulb, Home, Sparkles } from 'lucide-react'

interface TextInputProps {
  onTextSubmit: (text: string) => void
  selectedLanguage: string
}

const suggestions = {
  en: [
    "I want a 3-bedroom house with a large living room and modern kitchen",
    "Design a cozy 2BHK apartment with balcony and study room", 
    "Create a villa with swimming pool, garden, and 4 bedrooms",
    "I need a small studio apartment with efficient space utilization",
    "Design a duplex house with parking and terrace garden",
    "Create an open-plan living space with kitchen island"
  ],
  hi: [
    "मुझे एक बड़े लिविंग रूम और आधुनिक रसोई के साथ 3 बेडरूम का घर चाहिए",
    "बालकनी और अध्ययन कक्ष के साथ एक आरामदायक 2BHK अपार्टमेंट डिज़ाइन करें",
    "स्विमिंग पूल, बगीचा और 4 बेडरूम के साथ एक विला बनाएं",
    "मुझे कुशल स्थान उपयोग के साथ एक छोटा स्टूडियो अपार्टमेंट चाहिए",
    "पार्किंग और छत बगीचे के साथ एक डुप्लेक्स घर डिज़ाइन करें",
    "किचन आइलैंड के साथ एक खुला लिविंग स्पेस बनाएं"
  ]
}

export function TextInput({ onTextSubmit, selectedLanguage }: TextInputProps) {
  const [text, setText] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(true)

  const handleSubmit = () => {
    if (text.trim()) {
      onTextSubmit(text.trim())
      setText('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setText(suggestion)
    setShowSuggestions(false)
  }

  const currentSuggestions = suggestions[selectedLanguage as keyof typeof suggestions] || suggestions.en

  const placeholder = selectedLanguage === 'hi' 
    ? 'अपने सपनों के घर का विस्तार से वर्णन करें... जैसे: "मुझे 3 बेडरूम का घर चाहिए जिसमें एक बड़ा लिविंग रूम, आधुनिक रसोई और छोटा गार्डन हो।"'
    : 'Describe your dream home in detail... e.g., "I want a 3-bedroom house with a large living room, modern kitchen, and a small garden."'

  return (
    <div className="space-y-4">
      {/* Smart Suggestions */}
      {showSuggestions && (
        <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="font-medium text-amber-900">
              {selectedLanguage === 'hi' ? 'स्मार्ट सुझाव:' : 'Smart Suggestions:'}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {currentSuggestions.slice(0, 4).map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick(suggestion)}
                className="justify-start text-left h-auto p-3 hover:bg-amber-100 border-amber-300 text-amber-800"
              >
                <Home className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="text-sm line-clamp-2">{suggestion}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Text Input Area */}
      <div className="space-y-3">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="min-h-[120px] resize-none text-base"
          onFocus={() => setShowSuggestions(false)}
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{text.length} characters</span>
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="flex items-center gap-1 hover:text-amber-600 transition-colors"
            >
              <Lightbulb className="w-4 h-4" />
              {selectedLanguage === 'hi' ? 'सुझाव दिखाएं' : 'Show suggestions'}
            </button>
          </div>
          
          <Button 
            onClick={handleSubmit}
            disabled={!text.trim()}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Send className="w-4 h-4 mr-2" />
            {selectedLanguage === 'hi' ? 'डिज़ाइन बनाएं' : 'Generate Design'}
          </Button>
        </div>
      </div>

      {/* Input Tips */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2 text-gray-800">
          {selectedLanguage === 'hi' ? '💡 बेहतर परिणामों के लिए टिप्स:' : '💡 Tips for better results:'}
        </h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• {selectedLanguage === 'hi' ? 'कमरों की संख्या स्पष्ट रूप से बताएं' : 'Clearly mention number of rooms'}</li>
          <li>• {selectedLanguage === 'hi' ? 'विशेष सुविधाएं जैसे गार्डन, पार्किंग का उल्लेख करें' : 'Include special features like garden, parking'}</li>
          <li>• {selectedLanguage === 'hi' ? 'घर का आकार और स्टाइल बताएं' : 'Describe house size and style preferences'}</li>
          <li>• {selectedLanguage === 'hi' ? 'जितना विस्तार से बताएंगे, उतना बेहतर डिज़ाइन मिलेगा' : 'More details = better design results'}</li>
        </ul>
      </div>
    </div>
  )
}