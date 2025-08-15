
'use client'

import { useState, useEffect } from 'react'

/**
 * Hook personalizado para manejar fechas de manera segura evitando errores de hidratación
 */
export function useSafeDate() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const formatDate = (date: string | Date, locale: string = 'es-ES') => {
    if (!isClient) return '' // Retorna cadena vacía durante SSR
    try {
      return new Date(date).toLocaleDateString(locale)
    } catch (error) {
      return 'Fecha inválida'
    }
  }

  const getYear = (date: string | Date) => {
    if (!isClient) return '' // Retorna cadena vacía durante SSR
    try {
      return new Date(date).getFullYear().toString()
    } catch (error) {
      return ''
    }
  }

  const isRecentDate = (date: string | Date, daysBack: number = 30) => {
    if (!isClient) return false // Retorna false durante SSR
    try {
      const dateObj = new Date(date)
      const cutoffDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000)
      return dateObj > cutoffDate
    } catch (error) {
      return false
    }
  }

  return {
    isClient,
    formatDate,
    getYear,
    isRecentDate
  }
}
