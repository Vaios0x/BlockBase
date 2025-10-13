/**
 * Internationalization utilities for BlockBase
 * Multi-language support and localization
 */

export interface Translation {
  [key: string]: string | Translation
}

export interface LocaleConfig {
  code: string
  name: string
  flag: string
  rtl: boolean
  currency: string
  dateFormat: string
  numberFormat: Intl.NumberFormatOptions
}

export class I18nManager {
  private translations: Map<string, Translation> = new Map()
  private currentLocale: string = 'en'
  private fallbackLocale: string = 'en'
  private locales: LocaleConfig[] = []

  constructor() {
    this.initializeLocales()
  }

  private initializeLocales() {
    this.locales = [
      {
        code: 'en',
        name: 'English',
        flag: '🇺🇸',
        rtl: false,
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        numberFormat: { style: 'currency', currency: 'USD' }
      },
      {
        code: 'es',
        name: 'Español',
        flag: '🇪🇸',
        rtl: false,
        currency: 'EUR',
        dateFormat: 'DD/MM/YYYY',
        numberFormat: { style: 'currency', currency: 'EUR' }
      },
      {
        code: 'fr',
        name: 'Français',
        flag: '🇫🇷',
        rtl: false,
        currency: 'EUR',
        dateFormat: 'DD/MM/YYYY',
        numberFormat: { style: 'currency', currency: 'EUR' }
      },
      {
        code: 'de',
        name: 'Deutsch',
        flag: '🇩🇪',
        rtl: false,
        currency: 'EUR',
        dateFormat: 'DD.MM.YYYY',
        numberFormat: { style: 'currency', currency: 'EUR' }
      },
      {
        code: 'zh',
        name: '中文',
        flag: '🇨🇳',
        rtl: false,
        currency: 'CNY',
        dateFormat: 'YYYY/MM/DD',
        numberFormat: { style: 'currency', currency: 'CNY' }
      }
    ]
  }

  // Load translations
  async loadTranslations(locale: string, translations: Translation): Promise<void> {
    this.translations.set(locale, translations)
  }

  // Set current locale
  setLocale(locale: string): void {
    this.currentLocale = locale
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale
      document.documentElement.dir = this.getLocaleConfig(locale)?.rtl ? 'rtl' : 'ltr'
    }
  }

  // Get current locale
  getCurrentLocale(): string {
    return this.currentLocale
  }

  // Get available locales
  getAvailableLocales(): LocaleConfig[] {
    return this.locales
  }

  // Get locale configuration
  getLocaleConfig(locale: string): LocaleConfig | undefined {
    return this.locales.find(l => l.code === locale)
  }

  // Translate text
  t(key: string, params?: Record<string, any>): string {
    const translation = this.getTranslation(key)
    
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`)
      return key
    }

    return this.interpolate(translation, params)
  }

  // Get translation with fallback
  private getTranslation(key: string): string | null {
    const keys = key.split('.')
    let translation: any = this.translations.get(this.currentLocale)

    // Try current locale first
    for (const k of keys) {
      if (translation && typeof translation === 'object' && k in translation) {
        translation = translation[k]
      } else {
        translation = null
        break
      }
    }

    if (translation && typeof translation === 'string') {
      return translation
    }

    // Fallback to default locale
    if (this.currentLocale !== this.fallbackLocale) {
      translation = this.translations.get(this.fallbackLocale)
      for (const k of keys) {
        if (translation && typeof translation === 'object' && k in translation) {
          translation = translation[k]
        } else {
          translation = null
          break
        }
      }
    }

    return translation && typeof translation === 'string' ? translation : null
  }

  // Interpolate parameters
  private interpolate(text: string, params?: Record<string, any>): string {
    if (!params) return text

    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key] !== undefined ? String(params[key]) : match
    })
  }

  // Format number
  formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
    const locale = this.getCurrentLocale()
    const config = this.getLocaleConfig(locale)
    const formatOptions = { ...config?.numberFormat, ...options }
    
    return new Intl.NumberFormat(locale, formatOptions).format(value)
  }

  // Format currency
  formatCurrency(value: number, currency?: string): string {
    const locale = this.getCurrentLocale()
    const config = this.getLocaleConfig(locale)
    const currencyCode = currency || config?.currency || 'USD'
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode
    }).format(value)
  }

  // Format date
  formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
    const locale = this.getCurrentLocale()
    const formatOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    }
    
    return new Intl.DateTimeFormat(locale, formatOptions).format(date)
  }

  // Format relative time
  formatRelativeTime(date: Date): string {
    const locale = this.getCurrentLocale()
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
    const now = new Date()
    const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000)
    
    const intervals = [
      { unit: 'year', seconds: 31536000 },
      { unit: 'month', seconds: 2592000 },
      { unit: 'day', seconds: 86400 },
      { unit: 'hour', seconds: 3600 },
      { unit: 'minute', seconds: 60 },
      { unit: 'second', seconds: 1 }
    ] as const

    for (const { unit, seconds } of intervals) {
      const interval = Math.floor(diffInSeconds / seconds)
      if (interval !== 0) {
        return rtf.format(interval, unit)
      }
    }

    return rtf.format(0, 'second')
  }

  // Pluralization
  pluralize(count: number, singular: string, plural: string): string {
    const locale = this.getCurrentLocale()
    const rules = new Intl.PluralRules(locale)
    const rule = rules.select(count)
    
    switch (rule) {
      case 'one':
        return singular
      default:
        return plural
    }
  }

  // Detect user locale
  detectUserLocale(): string {
    if (typeof navigator === 'undefined') return this.fallbackLocale

    const browserLocale = navigator.language.split('-')[0]
    const availableLocales = this.locales.map(l => l.code)
    
    if (availableLocales.includes(browserLocale)) {
      return browserLocale
    }

    return this.fallbackLocale
  }

  // Initialize with user preferences
  async initialize(): Promise<void> {
    const detectedLocale = this.detectUserLocale()
    this.setLocale(detectedLocale)
    
    // Load translations for detected locale
    await this.loadDefaultTranslations(detectedLocale)
  }

  // Load default translations
  private async loadDefaultTranslations(locale: string): Promise<void> {
    const defaultTranslations: Record<string, Translation> = {
      en: {
        common: {
          loading: 'Loading...',
          error: 'An error occurred',
          success: 'Success',
          cancel: 'Cancel',
          confirm: 'Confirm',
          save: 'Save',
          delete: 'Delete',
          edit: 'Edit',
          view: 'View',
          search: 'Search',
          filter: 'Filter',
          sort: 'Sort'
        },
        property: {
          title: 'Properties',
          create: 'Create Property',
          rent: 'Rent Property',
          price: 'Price',
          area: 'Area',
          bedrooms: 'Bedrooms',
          bathrooms: 'Bathrooms',
          location: 'Location',
          amenities: 'Amenities'
        }
      },
      es: {
        common: {
          loading: 'Cargando...',
          error: 'Ocurrió un error',
          success: 'Éxito',
          cancel: 'Cancelar',
          confirm: 'Confirmar',
          save: 'Guardar',
          delete: 'Eliminar',
          edit: 'Editar',
          view: 'Ver',
          search: 'Buscar',
          filter: 'Filtrar',
          sort: 'Ordenar'
        },
        property: {
          title: 'Propiedades',
          create: 'Crear Propiedad',
          rent: 'Rentar Propiedad',
          price: 'Precio',
          area: 'Área',
          bedrooms: 'Dormitorios',
          bathrooms: 'Baños',
          location: 'Ubicación',
          amenities: 'Amenidades'
        }
      }
    }

    const translations = defaultTranslations[locale] || defaultTranslations.en
    await this.loadTranslations(locale, translations)
  }
}

// Export singleton instance
export const i18n = new I18nManager()

// React hook for internationalization
export function useI18n() {
  return {
    t: i18n.t.bind(i18n),
    setLocale: i18n.setLocale.bind(i18n),
    getCurrentLocale: i18n.getCurrentLocale.bind(i18n),
    getAvailableLocales: i18n.getAvailableLocales.bind(i18n),
    formatNumber: i18n.formatNumber.bind(i18n),
    formatCurrency: i18n.formatCurrency.bind(i18n),
    formatDate: i18n.formatDate.bind(i18n),
    formatRelativeTime: i18n.formatRelativeTime.bind(i18n),
    pluralize: i18n.pluralize.bind(i18n)
  }
}
