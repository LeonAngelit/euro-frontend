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

import Form from '../src/components/Form/Form.vue'

// ─── T12: AdminView ref values — R1, R2, R5, R9 ──────────────────────
describe('AdminView-like form — ref values — R1, R2, R5, R9', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    sessionStorage.clear()
  })

  it('test_AdminView_passwordFormRendersWithTwoFields — R1', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const passRef = ref<HTMLInputElement | null>(null)
    const passTwoRef = ref<HTMLInputElement | null>(null)

    // Simulate AdminView's change-password form inside Collapsible
    const AdminViewLike = defineComponent({
      setup() {
        return () => h(Form, {
          action: vi.fn(),
          error: false,
          submitValue: 'Submit',
          showPassword: true,
          fields: [
            { name: 'password', placeholder: 'Password', id: 'passwordField', type: 'password', setRef: (el: any) => passRef.value = el },
            { name: 'password', placeholder: 'Repeat Password', id: 'passwordTwoField', type: 'password', setRef: (el: any) => passTwoRef.value = el },
          ],
        })
      },
    })

    const wrapper = mount(AdminViewLike, {
      global: { plugins: [pinia, testI18n] },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.find('input[name="password"]').exists()).toBe(true)
    // There are two password fields
    const passwordInputs = wrapper.findAll('input[name="password"]')
    expect(passwordInputs.length).toBe(2)
  })

  it('test_AdminView_passwordRefsCaptureValues — R1, R5', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const passRef = ref<HTMLInputElement | null>(null)
    const passTwoRef = ref<HTMLInputElement | null>(null)

    const AdminViewLike = defineComponent({
      setup() {
        return () => h(Form, {
          action: vi.fn(),
          error: false,
          submitValue: 'Submit',
          showPassword: true,
          fields: [
            { name: 'password', placeholder: 'Password', id: 'passwordField', type: 'password', setRef: (el: any) => passRef.value = el },
            { name: 'password', placeholder: 'Repeat Password', id: 'passwordTwoField', type: 'password', setRef: (el: any) => passTwoRef.value = el },
          ],
        })
      },
    })

    const wrapper = mount(AdminViewLike, {
      global: { plugins: [pinia, testI18n] },
    })

    await wrapper.vm.$nextTick()
    await flushPromises()

    const passwordInputs = wrapper.findAll('input[name="password"]')
    await passwordInputs[0].setValue('masterpass123')
    await passwordInputs[1].setValue('masterpass123')
    await wrapper.vm.$nextTick()

    expect(passRef.value?.value).toBe('masterpass123')
    expect(passTwoRef.value?.value).toBe('masterpass123')
  })

  it('test_AdminView_requestFormRendersWithAllFields — R1', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const imgPathRef = ref<HTMLInputElement | null>(null)
    const framesRef = ref<HTMLInputElement | null>(null)
    const strengthRef = ref<HTMLInputElement | null>(null)
    const genStepsRef = ref<HTMLInputElement | null>(null)
    const cfgRef = ref<HTMLInputElement | null>(null)
    const endPercentRef = ref<HTMLInputElement | null>(null)

    // Simulate AdminView's request form
    const AdminViewLike = defineComponent({
      setup() {
        return () => h(Form, {
          action: vi.fn(),
          submitValue: 'Submit',
          fields: [
            { name: 'imgPath', placeholder: 'imgPath', id: 'imgPath', type: 'text', setRef: (el: any) => imgPathRef.value = el, required: false },
            { name: 'frames', placeholder: 'frames', id: 'frames', type: 'text', setRef: (el: any) => framesRef.value = el, required: false },
            { name: 'strength', placeholder: 'strength', id: 'strength', type: 'text', setRef: (el: any) => strengthRef.value = el, required: false },
            { name: 'genSteps', placeholder: 'genSteps', id: 'genSteps', type: 'text', setRef: (el: any) => genStepsRef.value = el, required: false },
            { name: 'cfg', placeholder: 'cfg', id: 'cfg', type: 'text', setRef: (el: any) => cfgRef.value = el, required: false },
            { name: 'endPercent', placeholder: 'endPercent', id: 'endPercent', type: 'text', setRef: (el: any) => endPercentRef.value = el, required: false },
          ],
        })
      },
    })

    const wrapper = mount(AdminViewLike, {
      global: { plugins: [pinia, testI18n] },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.find('input[name="imgPath"]').exists()).toBe(true)
    expect(wrapper.find('input[name="frames"]').exists()).toBe(true)
    expect(wrapper.find('input[name="strength"]').exists()).toBe(true)
    expect(wrapper.find('input[name="genSteps"]').exists()).toBe(true)
    expect(wrapper.find('input[name="cfg"]').exists()).toBe(true)
    expect(wrapper.find('input[name="endPercent"]').exists()).toBe(true)
  })

  it('test_AdminView_requestRefsCaptureValuesIndependently — R5', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const imgPathRef = ref<HTMLInputElement | null>(null)
    const framesRef = ref<HTMLInputElement | null>(null)
    const strengthRef = ref<HTMLInputElement | null>(null)
    const genStepsRef = ref<HTMLInputElement | null>(null)
    const cfgRef = ref<HTMLInputElement | null>(null)
    const endPercentRef = ref<HTMLInputElement | null>(null)

    const AdminViewLike = defineComponent({
      setup() {
        return () => h(Form, {
          action: vi.fn(),
          submitValue: 'Submit',
          fields: [
            { name: 'imgPath', placeholder: 'imgPath', id: 'imgPath', type: 'text', setRef: (el: any) => imgPathRef.value = el, required: false },
            { name: 'frames', placeholder: 'frames', id: 'frames', type: 'text', setRef: (el: any) => framesRef.value = el, required: false },
            { name: 'strength', placeholder: 'strength', id: 'strength', type: 'text', setRef: (el: any) => strengthRef.value = el, required: false },
            { name: 'genSteps', placeholder: 'genSteps', id: 'genSteps', type: 'text', setRef: (el: any) => genStepsRef.value = el, required: false },
            { name: 'cfg', placeholder: 'cfg', id: 'cfg', type: 'text', setRef: (el: any) => cfgRef.value = el, required: false },
            { name: 'endPercent', placeholder: 'endPercent', id: 'endPercent', type: 'text', setRef: (el: any) => endPercentRef.value = el, required: false },
          ],
        })
      },
    })

    const wrapper = mount(AdminViewLike, {
      global: { plugins: [pinia, testI18n] },
    })

    await wrapper.vm.$nextTick()
    await flushPromises()

    await wrapper.find('input[name="imgPath"]').setValue('/path/to/image.png')
    await wrapper.find('input[name="frames"]').setValue('30')
    await wrapper.find('input[name="strength"]').setValue('0.75')
    await wrapper.find('input[name="genSteps"]').setValue('50')
    await wrapper.find('input[name="cfg"]').setValue('7.5')
    await wrapper.find('input[name="endPercent"]').setValue('80')
    await wrapper.vm.$nextTick()

    expect(imgPathRef.value?.value).toBe('/path/to/image.png')
    expect(framesRef.value?.value).toBe('30')
    expect(strengthRef.value?.value).toBe('0.75')
    expect(genStepsRef.value?.value).toBe('50')
    expect(cfgRef.value?.value).toBe('7.5')
    expect(endPercentRef.value?.value).toBe('80')
  })

  it('test_AdminView_submitCapturesPasswordRefValues — R2', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const passRef = ref<HTMLInputElement | null>(null)
    const passTwoRef = ref<HTMLInputElement | null>(null)
    const capturedValues: Record<string, string> = {}

    const submitAction = vi.fn((event: Event) => {
      event.preventDefault()
      capturedValues.password = passRef.value?.value || ''
      capturedValues.password2 = passTwoRef.value?.value || ''
    })

    const AdminViewLike = defineComponent({
      setup() {
        return () => h(Form, {
          action: submitAction,
          error: false,
          submitValue: 'Submit',
          showPassword: true,
          fields: [
            { name: 'password', placeholder: 'Password', id: 'passwordField', type: 'password', setRef: (el: any) => passRef.value = el },
            { name: 'password', placeholder: 'Repeat Password', id: 'passwordTwoField', type: 'password', setRef: (el: any) => passTwoRef.value = el },
          ],
        })
      },
    })

    const wrapper = mount(AdminViewLike, {
      global: { plugins: [pinia, testI18n] },
    })

    await wrapper.vm.$nextTick()
    await flushPromises()

    const passwordInputs = wrapper.findAll('input[name="password"]')
    await passwordInputs[0].setValue('newmasterpass')
    await passwordInputs[1].setValue('newmasterpass')
    await wrapper.vm.$nextTick()

    await wrapper.find('form').trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    expect(capturedValues.password).toBe('newmasterpass')
    expect(capturedValues.password2).toBe('newmasterpass')
  })

  it('test_AdminView_submitCapturesRequestRefValues — R2, R5', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const imgPathRef = ref<HTMLInputElement | null>(null)
    const framesRef = ref<HTMLInputElement | null>(null)
    const strengthRef = ref<HTMLInputElement | null>(null)
    const capturedValues: Record<string, string> = {}

    const submitAction = vi.fn((event: Event) => {
      event.preventDefault()
      capturedValues.imgPath = imgPathRef.value?.value || ''
      capturedValues.frames = framesRef.value?.value || ''
      capturedValues.strength = strengthRef.value?.value || ''
    })

    const AdminViewLike = defineComponent({
      setup() {
        return () => h(Form, {
          action: submitAction,
          submitValue: 'Submit',
          fields: [
            { name: 'imgPath', placeholder: 'imgPath', id: 'imgPath', type: 'text', setRef: (el: any) => imgPathRef.value = el, required: false },
            { name: 'frames', placeholder: 'frames', id: 'frames', type: 'text', setRef: (el: any) => framesRef.value = el, required: false },
            { name: 'strength', placeholder: 'strength', id: 'strength', type: 'text', setRef: (el: any) => strengthRef.value = el, required: false },
          ],
        })
      },
    })

    const wrapper = mount(AdminViewLike, {
      global: { plugins: [pinia, testI18n] },
    })

    await wrapper.vm.$nextTick()
    await flushPromises()

    await wrapper.find('input[name="imgPath"]').setValue('/images/test.png')
    await wrapper.find('input[name="frames"]').setValue('60')
    await wrapper.find('input[name="strength"]').setValue('0.8')
    await wrapper.vm.$nextTick()

    await wrapper.find('form').trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    expect(capturedValues.imgPath).toBe('/images/test.png')
    expect(capturedValues.frames).toBe('60')
    expect(capturedValues.strength).toBe('0.8')
  })

  it('test_AdminView_modelRefAndPromptRefCaptureValues — R1', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const modelRef = ref<HTMLSelectElement | null>(null)
    const promptRef = ref<HTMLTextAreaElement | null>(null)

    // Simulate AdminView's select + textarea outside Form
    const AdminViewLike = defineComponent({
      setup() {
        return () => h('div', [
          h('select', { ref: modelRef }, [
            h('option', { value: '' }, 'Select model'),
            h('option', { value: 'image_to_video' }, 'Image to Video'),
            h('option', { value: 'model1' }, 'Model 1'),
            h('option', { value: 'model2' }, 'Model 2'),
          ]),
          h('textarea', { ref: promptRef, placeholder: 'Prompt' }),
        ])
      },
    })

    const wrapper = mount(AdminViewLike, {
      global: { plugins: [pinia, testI18n] },
    })

    await wrapper.vm.$nextTick()

    expect(modelRef.value).not.toBeNull()
    expect(promptRef.value).not.toBeNull()

    // Set select value
    modelRef.value!.value = 'image_to_video'
    await wrapper.vm.$nextTick()
    expect(modelRef.value?.value).toBe('image_to_video')

    // Set textarea value
    await wrapper.find('textarea').setValue('Generate a video of a sunset')
    await wrapper.vm.$nextTick()
    expect(promptRef.value?.value).toBe('Generate a video of a sunset')
  })
})
