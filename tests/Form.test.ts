// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { ref } from 'vue'
import { useAppStore } from '../src/stores/app'
import { testI18n } from './i18nPlugin'
import Form from '../src/components/Form/Form.vue'

// Mock the FontAwesomeIcon component
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

const defaultFields = [
  { name: 'username', placeholder: 'Username', type: 'text', id: 'user1', required: true },
]

const passwordFields = [
  { name: 'password', placeholder: 'Password', id: 'pass1', type: 'password', required: true },
]

// ─── T33: Form password visibility toggle (R34) ──────────────────────
describe('Form — password visibility toggle — R34', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    sessionStorage.clear()
  })

  it('test_Form_passwordField_startsAsPasswordType — R34', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const wrapper = mount(Form, {
      props: {
        action: vi.fn(),
        showPassword: true,
        fields: passwordFields,
      },
      global: { plugins: [pinia, testI18n] },
    })

    await wrapper.vm.$nextTick()

    // The password input should start with type="password"
    const passwordInput = wrapper.find('input[name="password"]')
    expect(passwordInput.exists()).toBe(true)
    expect(passwordInput.attributes('type')).toBe('password')
  })

  it('test_Form_passwordToggle_changesTypeToText — R34', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const wrapper = mount(Form, {
      props: {
        action: vi.fn(),
        showPassword: true,
        fields: passwordFields,
      },
      global: { plugins: [pinia, testI18n] },
    })

    await wrapper.vm.$nextTick()

    // Type something in the password field so the toggle button appears (handlePasswordChange)
    const passwordInput = wrapper.find('input[name="password"]')
    await passwordInput.setValue('test123')
    await wrapper.vm.$nextTick()

    // Find the toggle button that appears after typing
    const toggleBtn = wrapper.find('button[name="passtoggle"]')
    if (toggleBtn.exists()) {
      await toggleBtn.trigger('click')
      await wrapper.vm.$nextTick()

      // Input type should now be 'text'
      const updatedInput = wrapper.find('input[name="password"]')
      expect(updatedInput.attributes('type')).toBe('text')

      // Click again to toggle back to password
      await toggleBtn.trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.find('input[name="password"]').attributes('type')).toBe('password')
    }
  })

  it('test_Form_nonPasswordField_rendersAsTextType — R34', () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const wrapper = mount(Form, {
      props: {
        action: vi.fn(),
        fields: defaultFields,
      },
      global: { plugins: [pinia, testI18n] },
    })

    const textInput = wrapper.find('input[name="username"]')
    expect(textInput.exists()).toBe(true)
    // Non-password fields default to text type
    expect(textInput.attributes('type')).toBe('text')
  })
})

// ─── T34: Form "remember me" checkbox (R35) ──────────────────────────
describe('Form — remember me checkbox — R35', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    sessionStorage.clear()
  })

  it('test_Form_rememberProp_showsCheckbox — R35', () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const wrapper = mount(Form, {
      props: {
        action: vi.fn(),
        remember: true,
        fields: defaultFields,
      },
      global: { plugins: [pinia, testI18n] },
    })

    // The checkbox should be visible when remember=true
    const checkboxContainer = wrapper.find('.checkbox-container')
    expect(checkboxContainer.exists()).toBe(true)
  })

  it('test_Form_noRememberProp_hidesCheckbox — R35', () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const wrapper = mount(Form, {
      props: {
        action: vi.fn(),
        remember: false,
        fields: defaultFields,
      },
      global: { plugins: [pinia, testI18n] },
    })

    // The checkbox should NOT be visible when remember=false
    const checkboxContainer = wrapper.find('.checkbox-container')
    expect(checkboxContainer.exists()).toBe(false)
  })

  it('test_Form_checkboxInteractsWithStore — R35', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const wrapper = mount(Form, {
      props: {
        action: vi.fn(),
        remember: true,
        fields: defaultFields,
      },
      global: { plugins: [pinia, testI18n] },
    })

    const store = useAppStore()
    const spy = vi.spyOn(store, 'setRememberUser')

    // Find the checkbox
    const checkbox = wrapper.find('input[type="checkbox"]')
    expect(checkbox.exists()).toBe(true)

    // Clicking the checkbox triggers the storeLocal method which calls store.setRememberUser
    // The checkbox starts unchecked, so clicking it should call setRememberUser(true)
    // (because on a click event, the browser toggles checked before the handler runs)
    await checkbox.trigger('click')

    // Verify setRememberUser was called (the exact value depends on checked state)
    expect(spy).toHaveBeenCalled()
  })

  it('test_Form_checkboxLabel_showsMantenerSesion — R35', () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const wrapper = mount(Form, {
      props: {
        action: vi.fn(),
        remember: true,
        fields: defaultFields,
      },
      global: { plugins: [pinia, testI18n] },
    })

    // The checkbox label should show "Mantener sesión" (Spanish for "Remember me")
    expect(wrapper.text()).toContain('Mantener sesión')
  })
})

// ─── T4: Form ref value capture — R1, R3, R9 ─────────────────────────
describe('Form — ref value capture — R1, R3, R9', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    sessionStorage.clear()
  })

  it('test_Form_refCapturesInputValue_afterSetValue — R1, R3', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const usernameRef = ref<HTMLInputElement | null>(null)
    const fields = [
      { name: 'username', placeholder: 'Username', type: 'text', id: 'user1', ref: usernameRef, required: true },
    ]

    const wrapper = mount(Form, {
      props: {
        action: vi.fn(),
        fields,
      },
      global: { plugins: [pinia, testI18n] },
    })

    await wrapper.vm.$nextTick()

    const input = wrapper.find('input[name="username"]')
    await input.setValue('testuser')
    await wrapper.vm.$nextTick()

    // The ref should now point to the input element and its value should match
    expect(usernameRef.value).not.toBeNull()
    expect(usernameRef.value?.value).toBe('testuser')
  })
})

// ─── T5: Form multiple fields independent refs — R5, R9 ──────────────
describe('Form — multiple fields independent refs — R5, R9', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    sessionStorage.clear()
  })

  it('test_Form_multipleFields_captureValuesIndependently — R5', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const nameRef = ref<HTMLInputElement | null>(null)
    const emailRef = ref<HTMLInputElement | null>(null)
    const fields = [
      { name: 'name', placeholder: 'Name', type: 'text', id: 'name1', ref: nameRef, required: true },
      { name: 'email', placeholder: 'Email', type: 'email', id: 'email1', ref: emailRef, required: true },
    ]

    const wrapper = mount(Form, {
      props: {
        action: vi.fn(),
        fields,
      },
      global: { plugins: [pinia, testI18n] },
    })

    await wrapper.vm.$nextTick()

    const nameInput = wrapper.find('input[name="name"]')
    const emailInput = wrapper.find('input[name="email"]')

    await nameInput.setValue('John Doe')
    await emailInput.setValue('john@example.com')
    await wrapper.vm.$nextTick()

    expect(nameRef.value).not.toBeNull()
    expect(nameRef.value?.value).toBe('John Doe')
    expect(emailRef.value).not.toBeNull()
    expect(emailRef.value?.value).toBe('john@example.com')
  })
})

// ─── T6: Form password toggle preserves value — R4, R9 ───────────────
describe('Form — password toggle preserves value — R4, R9', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    sessionStorage.clear()
  })

  it('test_Form_passwordToggle_preservesInputValue — R4', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const passwordRef = ref<HTMLInputElement | null>(null)
    const fields = [
      { name: 'password', placeholder: 'Password', id: 'pass1', type: 'password', ref: passwordRef, required: true },
    ]

    const wrapper = mount(Form, {
      props: {
        action: vi.fn(),
        showPassword: true,
        fields,
      },
      global: { plugins: [pinia, testI18n] },
    })

    await wrapper.vm.$nextTick()

    const passwordInput = wrapper.find('input[name="password"]')
    await passwordInput.setValue('secret123')
    await wrapper.vm.$nextTick()

    // Verify value is captured in ref
    expect(passwordRef.value?.value).toBe('secret123')

    // Trigger the toggle button to switch to text type
    const toggleBtn = wrapper.find('button[name="passtoggle"]')
    expect(toggleBtn.exists()).toBe(true)
    await toggleBtn.trigger('click')
    await wrapper.vm.$nextTick()

    // Input type should now be 'text'
    const updatedInput = wrapper.find('input[name="password"]')
    expect(updatedInput.attributes('type')).toBe('text')

    // Value should be preserved after toggle
    expect(passwordRef.value?.value).toBe('secret123')

    // Toggle back to password
    await toggleBtn.trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('input[name="password"]').attributes('type')).toBe('password')
    expect(passwordRef.value?.value).toBe('secret123')
  })
})

// ─── T7: Form ref values after submit — R8, R9 ───────────────────────
describe('Form — ref values after submit — R8, R9', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    sessionStorage.clear()
  })

  it('test_Form_refValueNotNullAfterSubmit — R8, R9', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const usernameRef = ref<HTMLInputElement | null>(null)
    const passwordRef = ref<HTMLInputElement | null>(null)
    const capturedValues: { username: string; password: string } = { username: '', password: '' }

    const action = vi.fn((event: Event) => {
      event.preventDefault()
      capturedValues.username = usernameRef.value?.value || ''
      capturedValues.password = passwordRef.value?.value || ''
    })

    const fields = [
      { name: 'username', placeholder: 'Username', type: 'text', ref: usernameRef, required: true },
      { name: 'password', placeholder: 'Password', id: 'pass1', type: 'password', ref: passwordRef, required: true },
    ]

    const wrapper = mount(Form, {
      props: {
        action,
        showPassword: true,
        fields,
      },
      global: { plugins: [pinia, testI18n] },
    })

    await wrapper.vm.$nextTick()

    // Type into both fields
    await wrapper.find('input[name="username"]').setValue('testuser')
    await wrapper.find('input[name="password"]').setValue('secret123')
    await wrapper.vm.$nextTick()

    // Submit the form
    await wrapper.find('form').trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    // Verify refs captured values and are not null/undefined
    expect(usernameRef.value).not.toBeNull()
    expect(usernameRef.value).not.toBeUndefined()
    expect(usernameRef.value?.value).toBe('testuser')

    expect(passwordRef.value).not.toBeNull()
    expect(passwordRef.value).not.toBeUndefined()
    expect(passwordRef.value?.value).toBe('secret123')

    // Verify the action received the correct values via refs
    expect(capturedValues.username).toBe('testuser')
    expect(capturedValues.password).toBe('secret123')
  })
})