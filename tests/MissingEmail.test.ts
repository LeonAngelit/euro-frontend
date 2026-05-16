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

// ─── T10: MissingEmail view ref values — R1, R2, R9 ──────────────────
describe('MissingEmail-like form — ref values — R1, R2, R9', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    sessionStorage.clear()
  })

  it('test_MissingEmail_formRendersWithEmailField — R1', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const emailRef = ref<HTMLInputElement | null>(null)

    const MissingEmailLike = defineComponent({
      setup() {
        return () => h(Form, {
          action: vi.fn(),
          error: false,
          submitValue: 'Submit Email',
          fields: [
            { name: 'email', placeholder: 'Email', type: 'email', ref: emailRef, required: true },
          ],
        })
      },
    })

    const wrapper = mount(MissingEmailLike, {
      global: { plugins: [pinia, testI18n] },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.find('input[name="email"]').exists()).toBe(true)
    expect(wrapper.find('input[name="email"]').attributes('type')).toBe('email')
  })

  it('test_MissingEmail_refCapturesEmailValue — R1, R2', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const emailRef = ref<HTMLInputElement | null>(null)

    const MissingEmailLike = defineComponent({
      setup() {
        return () => h(Form, {
          action: vi.fn(),
          error: false,
          submitValue: 'Submit Email',
          fields: [
            { name: 'email', placeholder: 'Email', type: 'email', ref: emailRef, required: true },
          ],
        })
      },
    })

    const wrapper = mount(MissingEmailLike, {
      global: { plugins: [pinia, testI18n] },
    })

    await wrapper.vm.$nextTick()
    await flushPromises()

    // Type email
    await wrapper.find('input[name="email"]').setValue('user@example.com')
    await wrapper.vm.$nextTick()

    // Verify ref captured the value
    expect(emailRef.value?.value).toBe('user@example.com')
  })

  it('test_MissingEmail_submitCapturesEmailValue — R2', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const emailRef = ref<HTMLInputElement | null>(null)
    let capturedEmail = ''

    const submitAction = vi.fn((event: Event) => {
      event.preventDefault()
      capturedEmail = emailRef.value?.value || ''
    })

    const MissingEmailLike = defineComponent({
      setup() {
        return () => h(Form, {
          action: submitAction,
          error: false,
          submitValue: 'Submit Email',
          fields: [
            { name: 'email', placeholder: 'Email', type: 'email', ref: emailRef, required: true },
          ],
        })
      },
    })

    const wrapper = mount(MissingEmailLike, {
      global: { plugins: [pinia, testI18n] },
    })

    await wrapper.vm.$nextTick()
    await flushPromises()

    // Type email
    await wrapper.find('input[name="email"]').setValue('test@mail.com')
    await wrapper.vm.$nextTick()

    // Submit
    await wrapper.find('form').trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    // Verify captured email
    expect(capturedEmail).toBe('test@mail.com')
  })
})
