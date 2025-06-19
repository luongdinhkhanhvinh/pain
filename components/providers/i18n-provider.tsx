"use client"

import { useState, useEffect, type ReactNode } from "react"
import { I18nContext, detectLanguageFromTimezone, translations, type Language, type TranslationKey } from "@/lib/i18n"

interface I18nProviderProps {
  children: ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguageState] = useState<Language>("vi")
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize language on client side
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language

    if (savedLanguage && (savedLanguage === "vi" || savedLanguage === "en")) {
      setLanguageState(savedLanguage)
    } else {
      // Auto-detect from timezone
      const detectedLanguage = detectLanguageFromTimezone()
      setLanguageState(detectedLanguage)
      localStorage.setItem("language", detectedLanguage)
    }

    setIsInitialized(true)
  }, [])

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    localStorage.setItem("language", newLanguage)
  }

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key
  }

  // Don't render until initialized to prevent hydration mismatch
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  return <I18nContext.Provider value={{ language, setLanguage, t }}>{children}</I18nContext.Provider>
}
