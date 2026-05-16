// @vitest-environment jsdom

import { describe, it, expect, beforeEach } from 'vitest'
import { i18n } from '../src/locales'
import esMessages from '../src/locales/es.json'
import enMessages from '../src/locales/en.json'

describe('i18n — locale files', () => {
  it('test_i18n_es_and_en_have_identical_key_sets — R2, R7', () => {
    const esKeys = Object.keys(esMessages)
    const enKeys = Object.keys(enMessages)

    const missingInEn = esKeys.filter(k => !enKeys.includes(k))
    const extraInEn = enKeys.filter(k => !esKeys.includes(k))

    expect(missingInEn).toEqual([])
    expect(extraInEn).toEqual([])
  })

  it('test_i18n_es_has_non_empty_values — R2, R7', () => {
    for (const key of Object.keys(esMessages)) {
      const value = esMessages[key]
      expect(typeof value).toBe('string')
      expect((value as string).length).toBeGreaterThan(0)
    }
  })

  it('test_i18n_en_has_non_empty_values — R2, R7', () => {
    for (const key of Object.keys(enMessages)) {
      const value = enMessages[key]
      expect(typeof value).toBe('string')
      expect((value as string).length).toBeGreaterThan(0)
    }
  })
})

describe('i18n — plugin initialization', () => {
  beforeEach(() => {
    i18n.global.locale.value = 'es'
  })

  it('test_i18n_initializes_with_es_default — R1', () => {
    expect(i18n.global.locale.value).toBe('es')
    expect(i18n.global.fallbackLocale.value).toBe('es')
  })

  it('test_i18n_has_es_and_en_messages — R1, R2', () => {
    const messages = i18n.global.getLocaleMessage('es')
    expect(messages).toBeDefined()
    expect(Object.keys(messages).length).toBeGreaterThan(0)

    const enMessages = i18n.global.getLocaleMessage('en')
    expect(enMessages).toBeDefined()
    expect(Object.keys(enMessages).length).toBeGreaterThan(0)
  })

  it('test_i18n_switches_locale_reactively — R6', () => {
    i18n.global.locale.value = 'en'
    expect(i18n.global.locale.value).toBe('en')

    i18n.global.locale.value = 'es'
    expect(i18n.global.locale.value).toBe('es')
  })

  it('test_i18n_translates_key_correctly — R7', () => {
    i18n.global.locale.value = 'es'
    expect(i18n.global.t('nav.profile')).toBe('Perfil')

    i18n.global.locale.value = 'en'
    expect(i18n.global.t('nav.profile')).toBe('Profile')
  })

  it('test_i18n_fallback_to_es_for_missing_keys — R1', () => {
    i18n.global.locale.value = 'en'
    expect(i18n.global.fallbackLocale.value).toBe('es')
  })
})
