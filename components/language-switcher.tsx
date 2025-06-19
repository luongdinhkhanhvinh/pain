"use client"

import { useState } from "react"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTranslation } from "@/lib/i18n"
import { LANGUAGES, type Language } from "@/lib/i18n"

export function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">
            {LANGUAGES[language].flag} {LANGUAGES[language].name}
          </span>
          <span className="sm:hidden">{LANGUAGES[language].flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px]">
        {Object.entries(LANGUAGES).map(([code, lang]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleLanguageChange(code as Language)}
            className={`gap-2 ${language === code ? "bg-accent" : ""}`}
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
            {language === code && <span className="ml-auto text-xs text-muted-foreground">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
