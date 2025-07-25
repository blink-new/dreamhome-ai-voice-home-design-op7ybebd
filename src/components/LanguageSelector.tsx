import React from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Languages } from 'lucide-react'

interface LanguageSelectorProps {
  language: string
  onLanguageChange: (language: string) => void
}

const languages = [
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' }
]

export function LanguageSelector({ language, onLanguageChange }: LanguageSelectorProps) {
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Languages className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">
            {language === 'hi' ? 'भाषा चुनें' : 'Choose Language'}
          </h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {languages.map((lang) => (
            <Button
              key={lang.code}
              variant={language === lang.code ? 'default' : 'outline'}
              size="sm"
              onClick={() => onLanguageChange(lang.code)}
              className="justify-start space-x-2"
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="text-sm">{lang.name}</span>
            </Button>
          ))}
        </div>
        
        <p className="text-xs text-muted-foreground">
          {language === 'hi' 
            ? 'अपनी पसंदीदा भाषा में घर का वर्णन करें। AI सभी भारतीय भाषाओं को समझता है।'
            : 'Describe your home in your preferred language. AI understands all Indian languages.'
          }
        </p>
      </div>
    </Card>
  )
}