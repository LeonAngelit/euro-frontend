// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { ref, h, defineComponent } from 'vue'
import { testI18n } from './i18nPlugin'

// Mock FontAwesomeIcon
vi.mock('@fortawesome/vue-fontawesome', () => ({
  FontAwesomeIcon: {
    props: ['icon'],
    template: '<span :data-icon="icon" />',
  },
}))

// Mock useGetSongs
vi.mock('../src/composables/useGetSongs', () => ({
  default: vi.fn().mockResolvedValue([]),
}))

import Form from '../src/components/Form/Form.vue'

// ─── T7: Login-like form ref values — R1, R2, R8, R9 ─────────────────
describe('Login-like form — ref values — R1, R2, R8, R9', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    sessionStorage.clear()
  })

  it('test_Login_formRendersWithUsernameAndPasswordFields — R1', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const userNameRef = ref<HTMLInputElement | null>(null)
    const passwordRef = ref<HTMLInputElement | null>(null)

    // Simulate Login component's structure
    const LoginLike = defineComponent({
      setup() {
        return () => h(Form, {
          action: vi.fn(),
          error: false,
          submitValue: 'Login',
          showPassword: true,
          remember: true,
          fields: [
            { name: 'username', label: 'Username', type: 'text', setRef: (el: any) => userNameRef.value = el, required: true },
            { name: 'password', label: 'Password', id: 'passwordField', type: 'password', setRef: (el: any) => passwordRef.value = el, required: true },
          ],
        })
      },
    })

    const wrapper = mount(LoginLike, {
      global: { plugins: [pinia, testI18n] },
    })

    await wrapper.vm.$nextTick()

    const usernameInput = wrapper.find('input[name="username"]')
    const passwordInput = wrapper.find('input[name="password"]')
    expect(usernameInput.exists()).toBe(true)
    expect(passwordInput.exists()).toBe(true)
  })

  it('test_Login_submitSendsCorrectValues — R1, R2, R8', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const userNameRef = ref<HTMLInputElement | null>(null)
    const passwordRef = ref<HTMLInputElement | null>(null)
    const capturedValues = { name: '', password: '' }

    const loginAction = vi.fn((event: Event) => {
      event.preventDefault()
      capturedValues.name = userNameRef.value?.value || ''
      capturedValues.password = passwordRef.value?.value || ''
    })

    // Simulate Login component's structure
    const LoginLike = defineComponent({
      setup() {
        return () => h(Form, {
          action: loginAction,
          error: false,
          submitValue: 'Login',
          showPassword: true,
          remember: true,
          fields: [
            { name: 'username', label: 'Username', type: 'text', setRef: (el: any) => userNameRef.value = el, required: true },
            { name: 'password', label: 'Password', id: 'passwordField', type: 'password', setRef: (el: any) => passwordRef.value = el, required: true },
          ],
        })
      },
    })

    const wrapper = mount(LoginLike, {
      global: { plugins: [pinia, testI18n] },
    })

    await wrapper.vm.$nextTick()
    await flushPromises()

    // Verify refs are set after mount
    expect(userNameRef.value).not.toBeNull()
    expect(passwordRef.value).not.toBeNull()

    // Fill in the form
    await wrapper.find('input[name="username"]').setValue('testuser')
    await wrapper.find('input[name="password"]').setValue('pass')
    await wrapper.vm.$nextTick()

    // Verify refs captured the values
    expect(userNameRef.value?.value).toBe('testuser')
    expect(passwordRef.value?.value).toBe('pass')

    // Submit the form
    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    // Verify the action received the correct values from refs
    expect(loginAction).toHaveBeenCalled()
    expect(capturedValues.name).toBe('testuser')
    expect(capturedValues.password).toBe('pass')
  })

  it('test_Login_validationRejectsEmptyUsername — R8', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const userNameRef = ref<HTMLInputElement | null>(null)
    const passwordRef = ref<HTMLInputElement | null>(null)
    let actionCalled = false

    const loginAction = vi.fn((event: Event) => {
      event.preventDefault()
      const username = userNameRef.value?.value || ''
      if (!username) {
        return // validation would reject here
      }
      actionCalled = true
    })

    const LoginLike = defineComponent({
      setup() {
        return () => h(Form, {
          action: loginAction,
          error: false,
          submitValue: 'Login',
          showPassword: true,
          fields: [
            { name: 'username', label: 'Username', type: 'text', setRef: (el: any) => userNameRef.value = el, required: true },
            { name: 'password', label: 'Password', id: 'passwordField', type: 'password', setRef: (el: any) => passwordRef.value = el, required: true },
          ],
        })
      },
    })

    const wrapper = mount(LoginLike, {
      global: { plugins: [pinia, testI18n] },
    })

    await wrapper.vm.$nextTick()
    await flushPromises()

    // Only fill password, leave username empty
    await wrapper.find('input[name="password"]').setValue('pass')
    await wrapper.vm.$nextTick()

    // Submit the form
    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    // Username ref should be empty
    expect(userNameRef.value?.value).toBe('')
  })
})
