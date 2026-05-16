// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useDetectLocale } from '../src/composables/useDetectLocale'

describe('useDetectLocale', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('test_useDetectLocale_returns_es_from_localStorage_when_saved — R4, R5, R9', async () => {
    localStorage.setItem('user-locale', 'es')
    const result = await useDetectLocale()
    expect(result).toBe('es')
  })

  it('test_useDetectLocale_returns_en_from_localStorage_when_saved — R4, R5, R9', async () => {
    localStorage.setItem('user-locale', 'en')
    const result = await useDetectLocale()
    expect(result).toBe('en')
  })

  it('test_useDetectLocale_maps_spanish_country_to_es — R4, R9', async () => {
    localStorage.clear()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ country_code: 'ES' }),
    }))

    const result = await useDetectLocale()
    expect(result).toBe('es')
    expect(localStorage.getItem('user-locale')).toBe('es')
  })

  it('test_useDetectLocale_maps_mexico_to_es — R4, R9', async () => {
    localStorage.clear()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ country_code: 'MX' }),
    }))

    const result = await useDetectLocale()
    expect(result).toBe('es')
  })

  it('test_useDetectLocale_maps_argentina_to_es — R4, R9', async () => {
    localStorage.clear()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ country_code: 'AR' }),
    }))

    const result = await useDetectLocale()
    expect(result).toBe('es')
  })

  it('test_useDetectLocale_maps_non_spanish_country_to_es_default — R5, R9', async () => {
    localStorage.clear()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ country_code: 'US' }),
    }))

    const result = await useDetectLocale()
    // Default is always 'es' per the design
    expect(result).toBe('es')
  })

  it('test_useDetectLocale_maps_uk_to_es_default — R5, R9', async () => {
    localStorage.clear()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ country_code: 'GB' }),
    }))

    const result = await useDetectLocale()
    expect(result).toBe('es')
  })

  it('test_useDetectLocale_falls_back_to_es_on_fetch_failure — R5, R9', async () => {
    localStorage.clear()
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))

    const result = await useDetectLocale()
    expect(result).toBe('es')
  })

  it('test_useDetectLocale_falls_back_to_es_on_invalid_response — R5, R9', async () => {
    localStorage.clear()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}), // no country_code
    }))

    const result = await useDetectLocale()
    expect(result).toBe('es')
  })

  it('test_useDetectLocale_persists_to_localStorage — R4, R9', async () => {
    localStorage.clear()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ country_code: 'ES' }),
    }))

    await useDetectLocale()
    expect(localStorage.getItem('user-locale')).toBe('es')
  })

  it('test_useDetectLocale_uses_fallback_ip_api_on_primary_failure — R5, R9', async () => {
    localStorage.clear()
    let callCount = 0
    vi.stubGlobal('fetch', vi.fn().mockImplementation((url: string) => {
      callCount++
      if (url.includes('ipapi.co')) {
        return Promise.reject(new Error('Primary failed'))
      }
      // Fallback
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ countryCode: 'ES' }),
      })
    }))

    const result = await useDetectLocale()
    expect(result).toBe('es')
  })
})
