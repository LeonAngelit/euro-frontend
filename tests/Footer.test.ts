// @vitest-environment jsdom

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Footer from '../src/components/Footer/Footer.vue'

// ─── T40: Footer author name and year (R41) ─────────────────────────▶
describe('Footer — R41', () => {
  it('test_Footer_rendersAuthorName — R41', () => {
    const wrapper = mount(Footer)
    expect(wrapper.text()).toContain('Leonardo Angelit')
  })

  it('test_Footer_rendersCurrentYear — R41', () => {
    const wrapper = mount(Footer)
    const currentYear = new Date().getFullYear().toString()
    expect(wrapper.text()).toContain(currentYear)
  })
})