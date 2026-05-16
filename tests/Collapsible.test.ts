// @vitest-environment jsdom

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { testI18n } from './i18nPlugin'
import Collapsible from '../src/components/Collapsible/Collapsible.vue'

// ─── T29: Collapsible collapsed default state and `+` indicator (R30) ──
describe('Collapsible — R30', () => {
  it('test_Collapsible_defaultCollapsed_false_showsPlusIndicator — R30', () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const wrapper = mount(Collapsible, {
      props: {
        title: 'Test Section',
      },
      global: { plugins: [pinia, testI18n] },
    })

    // Default collapsed is false (per withDefaults), so isCollapsed starts false
    // Content should NOT be visible, and indicator should be '+'
    expect(wrapper.find('.collapsible-content').exists()).toBe(false)
    expect(wrapper.find('span').text()).toBe('+')
  })

  it('test_Collapsible_collapsed_true_showsMinusIndicator — R30', () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const wrapper = mount(Collapsible, {
      props: {
        title: 'Test Section',
        collapsed: true,
      },
      global: { plugins: [pinia, testI18n] },
    })

    // collapsed=true, so isCollapsed starts true
    expect(wrapper.find('.collapsible-content').exists()).toBe(true)
    expect(wrapper.find('span').text()).toBe('−')
  })

  it('test_Collapsible_rendersTitle — R30', () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const wrapper = mount(Collapsible, {
      props: { title: 'My Section' },
      global: { plugins: [pinia, testI18n] },
    })

    expect(wrapper.find('h3').text()).toBe('My Section')
  })
})

// ─── T30: Collapsible toggle behavior and `toggle` emit (R31) ────────
describe('Collapsible — toggle — R31', () => {
  it('test_Collapsible_clickTogglesVisibility — R31', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const wrapper = mount(Collapsible, {
      props: { title: 'Test', collapsed: false },
      global: { plugins: [pinia, testI18n] },
    })

    // Initially not collapsed (collapsed prop=false, isCollapsed=false)
    expect(wrapper.find('.collapsible-content').exists()).toBe(false)

    // Click the button to toggle
    await wrapper.find('button.collapsible-header').trigger('click')

    // Now it should be collapsed (isCollapsed=true)
    expect(wrapper.find('.collapsible-content').exists()).toBe(true)
    expect(wrapper.find('span').text()).toBe('−')
  })

  it('test_Collapsible_clickEmitsToggleEvent — R31', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const wrapper = mount(Collapsible, {
      props: { title: 'Test', collapsed: false },
      global: { plugins: [pinia, testI18n] },
    })

    await wrapper.find('button.collapsible-header').trigger('click')

    expect(wrapper.emitted('toggle')).toBeTruthy()
    expect(wrapper.emitted('toggle').length).toBe(1)
  })

  it('test_Collapsible_multipleToggles — R31', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const wrapper = mount(Collapsible, {
      props: { title: 'Test', collapsed: true },
      global: { plugins: [pinia, testI18n] },
    })

    // Click to expand
    await wrapper.find('button.collapsible-header').trigger('click')
    expect(wrapper.find('.collapsible-content').exists()).toBe(false)

    // Click to collapse
    await wrapper.find('button.collapsible-header').trigger('click')
    expect(wrapper.find('.collapsible-content').exists()).toBe(true)

    expect(wrapper.emitted('toggle').length).toBe(2)
  })
})