// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { testI18n } from './i18nPlugin'

// Mock vue-router since NotFound uses useRouter
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

// Mock useGetSongs
vi.mock('../src/composables/useGetSongs', () => ({
  default: vi.fn().mockResolvedValue([]),
}))

import NotFound from '../src/components/NotFound/NotFound.vue'

// ─── T41: NotFound not-found message (R42) ──────────────────────────
describe('NotFound — R42', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('test_NotFound_renders404Message — R42', () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const wrapper = mount(NotFound, {
      global: { plugins: [pinia, testI18n] },
    })

    expect(wrapper.find('h1').text()).toBe('404')
    expect(wrapper.find('p').text()).toContain('no encontrada')
  })

  it('test_NotFound_hasNotFoundClass — R42', () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const wrapper = mount(NotFound, {
      global: { plugins: [pinia, testI18n] },
    })

    expect(wrapper.find('.not-found').exists()).toBe(true)
  })
})