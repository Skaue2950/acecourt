import { useContext, createContext } from 'react'
import { translations, type Language, type TranslationKey } from './translations'

type TranslationValue = string | { [key: string]: TranslationValue }

function getTranslationValue(obj: TranslationValue, keys: string[]): string | undefined {
  let current: any = obj
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key]
    } else {
      return undefined
    }
  }
  return typeof current === 'string' ? current : undefined
}

export function t(language: Language, key: TranslationKey, defaultValue?: string): string {
  const keys = key.split('.')
  const translation = getTranslationValue(translations[language], keys)
  return translation || defaultValue || key
}

export interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function useTranslation() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider')
  }
  const { language } = context
  return (key: TranslationKey, defaultValue?: string) =>
    t(language, key, defaultValue)
}

export function useLanguage() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useLanguage must be used within an I18nProvider')
  }
  return context
}
