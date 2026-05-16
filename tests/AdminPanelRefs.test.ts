// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { ref } from 'vue'
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

// Mock useGetSongs
vi.mock('../src/composables/useGetSongs', () => ({
  default: vi.fn().mockResolvedValue([]),
}))

import AdminPanel from '../src/components/AdminPanel/AdminPanel.vue'

// ─── T11: AdminPanel ref values — R7, R9 ─────────────────────────────
describe('AdminPanel — ref values — R7, R9', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    sessionStorage.clear()
  })

  it('test_AdminPanel_rendersPasswordField — R7', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const passwordRef = ref<HTMLInputElement | null>(null)

    const wrapper = mount(AdminPanel, {
      props: {
        action: vi.fn(),
        refer: (el: any) => { passwordRef.value = el },
        error: {},
        close: vi.fn(),
      },
      global: {
        plugins: [pinia, testI18n],
      },
    })

    await wrapper.vm.$nextTick()

    // AdminPanel renders a Form with a password field
    const passwordInput = wrapper.find('input[name="password"]')
    expect(passwordInput.exists()).toBe(true)
    expect(passwordInput.attributes('type')).toBe('password')
  })

  it('test_AdminPanel_passwordRefCapturesValue — R7', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const passwordRef = ref<HTMLInputElement | null>(null)

    const wrapper = mount(AdminPanel, {
      props: {
        action: vi.fn(),
        refer: (el: any) => { passwordRef.value = el },
        error: {},
        close: vi.fn(),
      },
      global: {
        plugins: [pinia, testI18n],
      },
    })

    await wrapper.vm.$nextTick()
    await flushPromises()

    // Type password
    await wrapper.find('input[name="password"]').setValue('adminpass')
    await wrapper.vm.$nextTick()

    // Verify ref captured the value
    expect(passwordRef.value?.value).toBe('adminpass')
  })

  it('test_AdminPanel_submitCapturesPasswordValue — R7', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const passwordRef = ref<HTMLInputElement | null>(null)
    let capturedPassword = ''

    const loginAction = vi.fn((event: Event) => {
      event.preventDefault()
      capturedPassword = passwordRef.value?.value || ''
    })

    const wrapper = mount(AdminPanel, {
      props: {
        action: loginAction,
        refer: (el: any) => { passwordRef.value = el },
        error: {},
        close: vi.fn(),
      },
      global: {
        plugins: [pinia, testI18n],
      },
    })

    await wrapper.vm.$nextTick()
    await flushPromises()

    // Type password
    await wrapper.find('input[name="password"]').setValue('secretadmin')
    await wrapper.vm.$nextTick()

    // Submit
    await wrapper.find('form').trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    // Verify captured password
    expect(capturedPassword).toBe('secretadmin')
  })

  it('test_AdminPanel_closeButtonStillWorks — R7', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const closeFn = vi.fn()

    const wrapper = mount(AdminPanel, {
      props: {
        action: vi.fn(),
        refer: (el: any) => {},
        error: {},
        close: closeFn,
      },
      global: {
        plugins: [pinia, testI18n],
      },
    })

    await wrapper.vm.$nextTick()

    const closeButton = wrapper.find('.close-panel-button')
    await closeButton.trigger('click')
    expect(closeFn).toHaveBeenCalledOnce()
  })
})
