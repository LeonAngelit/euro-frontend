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

// ─── T8: SignUp view ref values — R1, R2, R5, R9 ─────────────────────
describe('SignUp-like form — ref values — R1, R2, R5, R9', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    sessionStorage.clear()
  })

  it('test_SignUp_formRendersWithAllFourFields — R1', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const userNameRef = ref<HTMLInputElement | null>(null)
    const emailRef = ref<HTMLInputElement | null>(null)
    const passwordRef = ref<HTMLInputElement | null>(null)
    const passwordTwodRef = ref<HTMLInputElement | null>(null)

    const SignUpLike = defineComponent({
      setup() {
        return () => h(Form, {
          action: vi.fn(),
          error: false,
          submitValue: 'Register',
          showPassword: true,
          remember: true,
          fields: [
            { name: 'username', placeholder: 'Username', type: 'text', setRef: (el: any) => userNameRef.value = el, required: true },
            { name: 'email', placeholder: 'Email', type: 'email', setRef: (el: any) => emailRef.value = el, required: true },
            { name: 'password', placeholder: 'Password', id: 'passwordOne', type: 'password', setRef: (el: any) => passwordRef.value = el, required: true },
            { name: 'password2', placeholder: 'Repeat Password', id: 'passwordTwo', type: 'password', setRef: (el: any) => passwordTwodRef.value = el, required: true },
          ],
        })
      },
    })

    const wrapper = mount(SignUpLike, {
      global: { plugins: [pinia, testI18n] },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.find('input[name="username"]').exists()).toBe(true)
    expect(wrapper.find('input[name="email"]').exists()).toBe(true)
    expect(wrapper.find('input[name="password"]').exists()).toBe(true)
    expect(wrapper.find('input[name="password2"]').exists()).toBe(true)
  })

  it('test_SignUp_allRefsCaptureValuesIndependently — R1, R2, R5', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const userNameRef = ref<HTMLInputElement | null>(null)
    const emailRef = ref<HTMLInputElement | null>(null)
    const passwordRef = ref<HTMLInputElement | null>(null)
    const passwordTwodRef = ref<HTMLInputElement | null>(null)

    const SignUpLike = defineComponent({
      setup() {
        return () => h(Form, {
          action: vi.fn(),
          error: false,
          submitValue: 'Register',
          showPassword: true,
          fields: [
            { name: 'username', placeholder: 'Username', type: 'text', setRef: (el: any) => userNameRef.value = el, required: true },
            { name: 'email', placeholder: 'Email', type: 'email', setRef: (el: any) => emailRef.value = el, required: true },
            { name: 'password', placeholder: 'Password', id: 'passwordOne', type: 'password', setRef: (el: any) => passwordRef.value = el, required: true },
            { name: 'password2', placeholder: 'Repeat Password', id: 'passwordTwo', type: 'password', setRef: (el: any) => passwordTwodRef.value = el, required: true },
          ],
        })
      },
    })

    const wrapper = mount(SignUpLike, {
      global: { plugins: [pinia, testI18n] },
    })

    await wrapper.vm.$nextTick()
    await flushPromises()

    // Fill all 4 fields
    await wrapper.find('input[name="username"]').setValue('newuser')
    await wrapper.find('input[name="email"]').setValue('newuser@example.com')
    await wrapper.find('input[name="password"]').setValue('secret1')
    await wrapper.find('input[name="password2"]').setValue('secret1')
    await wrapper.vm.$nextTick()

    // Verify all refs contain the entered values
    expect(userNameRef.value?.value).toBe('newuser')
    expect(emailRef.value?.value).toBe('newuser@example.com')
    expect(passwordRef.value?.value).toBe('secret1')
    expect(passwordTwodRef.value?.value).toBe('secret1')
  })

  it('test_SignUp_submitCapturesAllRefValues — R2, R5', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const userNameRef = ref<HTMLInputElement | null>(null)
    const emailRef = ref<HTMLInputElement | null>(null)
    const passwordRef = ref<HTMLInputElement | null>(null)
    const passwordTwodRef = ref<HTMLInputElement | null>(null)
    const capturedValues: Record<string, string> = {}

    const signUpAction = vi.fn((event: Event) => {
      event.preventDefault()
      capturedValues.username = userNameRef.value?.value || ''
      capturedValues.email = emailRef.value?.value || ''
      capturedValues.password = passwordRef.value?.value || ''
      capturedValues.password2 = passwordTwodRef.value?.value || ''
    })

    const SignUpLike = defineComponent({
      setup() {
        return () => h(Form, {
          action: signUpAction,
          error: false,
          submitValue: 'Register',
          showPassword: true,
          fields: [
            { name: 'username', placeholder: 'Username', type: 'text', setRef: (el: any) => userNameRef.value = el, required: true },
            { name: 'email', placeholder: 'Email', type: 'email', setRef: (el: any) => emailRef.value = el, required: true },
            { name: 'password', placeholder: 'Password', id: 'passwordOne', type: 'password', setRef: (el: any) => passwordRef.value = el, required: true },
            { name: 'password2', placeholder: 'Repeat Password', id: 'passwordTwo', type: 'password', setRef: (el: any) => passwordTwodRef.value = el, required: true },
          ],
        })
      },
    })

    const wrapper = mount(SignUpLike, {
      global: { plugins: [pinia, testI18n] },
    })

    await wrapper.vm.$nextTick()
    await flushPromises()

    // Fill all fields
    await wrapper.find('input[name="username"]').setValue('signupuser')
    await wrapper.find('input[name="email"]').setValue('signup@test.com')
    await wrapper.find('input[name="password"]').setValue('pass123')
    await wrapper.find('input[name="password2"]').setValue('pass123')
    await wrapper.vm.$nextTick()

    // Submit
    await wrapper.find('form').trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    // Verify captured values match
    expect(capturedValues.username).toBe('signupuser')
    expect(capturedValues.email).toBe('signup@test.com')
    expect(capturedValues.password).toBe('pass123')
    expect(capturedValues.password2).toBe('pass123')
  })
})
