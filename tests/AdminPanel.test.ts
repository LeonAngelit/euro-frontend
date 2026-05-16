// @vitest-environment jsdom

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { testI18n } from './i18nPlugin'

// Mock FontAwesomeIcon
vi.mock('@fortawesome/vue-fontawesome', () => ({
  FontAwesomeIcon: {
    props: ['icon'],
    template: '<span :data-icon="icon" />',
  },
}))

// Mock config
vi.mock('../src/config/config', () => ({
  default: {
    baseUrl: 'http://test-api/',
    appAdmin: 'admin',
    authP: '',
    key: '',
    defProfilePicUrl: '',
    joinRoomLink: '',
    confirmemailLink: '',
    joinRoomPath: '',
    clientID: '',
    requestsUrl: '',
    requestsBaseUrl: '',
    env: 'test',
    isProd: false,
  },
}))

import AdminPanel from '../src/components/AdminPanel/AdminPanel.vue'

// ─── T35: AdminPanel close button (R36) ──────────────────────────────
describe('AdminPanel — close button — R36', () => {
  it('test_AdminPanel_closeButton_callsCloseCallback — R36', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const close = vi.fn()
    const action = vi.fn()

    const wrapper = mount(AdminPanel, {
      props: {
        action,
        refer: null,
        error: {},
        close,
      },
      global: {
        plugins: [pinia, testI18n],
        stubs: {
          Form: true,
        },
      },
    })

    const closeButton = wrapper.find('.close-panel-button')
    expect(closeButton.exists()).toBe(true)

    await closeButton.trigger('click')
    expect(close).toHaveBeenCalledOnce()
  })

  it('test_AdminPanel_rendersCloseButtonWithX — R36', () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const close = vi.fn()
    const action = vi.fn()

    const wrapper = mount(AdminPanel, {
      props: {
        action,
        refer: null,
        error: {},
        close,
      },
      global: {
        plugins: [pinia, testI18n],
        stubs: {
          Form: true,
        },
      },
    })

    const closeButton = wrapper.find('.close-panel-button')
    expect(closeButton.text()).toBe('X')
  })
})