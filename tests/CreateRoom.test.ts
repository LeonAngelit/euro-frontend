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

// ─── T9: CreateRoom view ref values — R1, R2, R5, R9 ─────────────────
describe('CreateRoom-like form — ref values — R1, R2, R5, R9', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    sessionStorage.clear()
  })

  it('test_CreateRoom_formRendersWithAllThreeFields — R1', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const roomNameRef = ref<HTMLInputElement | null>(null)
    const passwordRef = ref<HTMLInputElement | null>(null)
    const passwordTwodRef = ref<HTMLInputElement | null>(null)

    const CreateRoomLike = defineComponent({
      setup() {
        return () => h(Form, {
          action: vi.fn(),
          error: false,
          submitValue: 'Create Room',
          showPassword: true,
          fields: [
            { name: 'username', placeholder: 'Room Name', type: 'text', setRef: (el: any) => roomNameRef.value = el, required: true },
            { name: 'password', placeholder: 'Password', id: 'passwordOne', type: 'password', setRef: (el: any) => passwordRef.value = el, required: true },
            { name: 'password2', placeholder: 'Repeat Password', id: 'passwordTwo', type: 'password', setRef: (el: any) => passwordTwodRef.value = el, required: true },
          ],
        })
      },
    })

    const wrapper = mount(CreateRoomLike, {
      global: { plugins: [pinia, testI18n] },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.find('input[name="username"]').exists()).toBe(true)
    expect(wrapper.find('input[name="password"]').exists()).toBe(true)
    expect(wrapper.find('input[name="password2"]').exists()).toBe(true)
  })

  it('test_CreateRoom_allRefsCaptureValues — R1, R2, R5', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const roomNameRef = ref<HTMLInputElement | null>(null)
    const passwordRef = ref<HTMLInputElement | null>(null)
    const passwordTwodRef = ref<HTMLInputElement | null>(null)

    const CreateRoomLike = defineComponent({
      setup() {
        return () => h(Form, {
          action: vi.fn(),
          error: false,
          submitValue: 'Create Room',
          showPassword: true,
          fields: [
            { name: 'username', placeholder: 'Room Name', type: 'text', setRef: (el: any) => roomNameRef.value = el, required: true },
            { name: 'password', placeholder: 'Password', id: 'passwordOne', type: 'password', setRef: (el: any) => passwordRef.value = el, required: true },
            { name: 'password2', placeholder: 'Repeat Password', id: 'passwordTwo', type: 'password', setRef: (el: any) => passwordTwodRef.value = el, required: true },
          ],
        })
      },
    })

    const wrapper = mount(CreateRoomLike, {
      global: { plugins: [pinia, testI18n] },
    })

    await wrapper.vm.$nextTick()
    await flushPromises()

    // Fill all 3 fields
    await wrapper.find('input[name="username"]').setValue('My Awesome Room')
    await wrapper.find('input[name="password"]').setValue('roompass')
    await wrapper.find('input[name="password2"]').setValue('roompass')
    await wrapper.vm.$nextTick()

    // Verify all refs contain entered values
    expect(roomNameRef.value?.value).toBe('My Awesome Room')
    expect(passwordRef.value?.value).toBe('roompass')
    expect(passwordTwodRef.value?.value).toBe('roompass')
  })

  it('test_CreateRoom_submitCapturesAllRefValues — R2, R5', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const roomNameRef = ref<HTMLInputElement | null>(null)
    const passwordRef = ref<HTMLInputElement | null>(null)
    const passwordTwodRef = ref<HTMLInputElement | null>(null)
    const capturedValues: Record<string, string> = {}

    const createRoomAction = vi.fn((event: Event) => {
      event.preventDefault()
      capturedValues.roomName = roomNameRef.value?.value || ''
      capturedValues.password = passwordRef.value?.value || ''
      capturedValues.password2 = passwordTwodRef.value?.value || ''
    })

    const CreateRoomLike = defineComponent({
      setup() {
        return () => h(Form, {
          action: createRoomAction,
          error: false,
          submitValue: 'Create Room',
          showPassword: true,
          fields: [
            { name: 'username', placeholder: 'Room Name', type: 'text', setRef: (el: any) => roomNameRef.value = el, required: true },
            { name: 'password', placeholder: 'Password', id: 'passwordOne', type: 'password', setRef: (el: any) => passwordRef.value = el, required: true },
            { name: 'password2', placeholder: 'Repeat Password', id: 'passwordTwo', type: 'password', setRef: (el: any) => passwordTwodRef.value = el, required: true },
          ],
        })
      },
    })

    const wrapper = mount(CreateRoomLike, {
      global: { plugins: [pinia, testI18n] },
    })

    await wrapper.vm.$nextTick()
    await flushPromises()

    // Fill all fields
    await wrapper.find('input[name="username"]').setValue('Test Room')
    await wrapper.find('input[name="password"]').setValue('testpass')
    await wrapper.find('input[name="password2"]').setValue('testpass')
    await wrapper.vm.$nextTick()

    // Submit
    await wrapper.find('form').trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    // Verify captured values
    expect(capturedValues.roomName).toBe('Test Room')
    expect(capturedValues.password).toBe('testpass')
    expect(capturedValues.password2).toBe('testpass')
  })
})
