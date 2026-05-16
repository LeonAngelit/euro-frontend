// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { ref, h, defineComponent } from 'vue'
import { testI18n } from './i18nPlugin'
import { useAppStore } from '../src/stores/app'

// Mock FontAwesomeIcon
vi.mock('@fortawesome/vue-fontawesome', () => ({
  FontAwesomeIcon: {
    props: ['icon'],
    template: '<span :data-icon="icon" />',
  },
}))

// Mock vue-router
const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
  useRoute: () => ({ path: '/profile' }),
}))

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn().mockResolvedValue({ status: 200, data: {} }),
  },
}))

// Mock config
vi.mock('../src/config/config', () => ({
  default: {
    baseUrl: 'http://test-api/',
    appAdmin: 'admin',
    authP: '',
    key: '',
    defProfilePicUrl: 'https://ui-avatars.com/api/',
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

// Mock composables
vi.mock('../src/composables/useHandleCloseSession', () => ({
  default: vi.fn(),
}))

vi.mock('../src/composables/useValidateToken', () => ({
  default: vi.fn().mockResolvedValue(true),
}))

vi.mock('../src/composables/useNavigateWithCallback', () => ({
  default: vi.fn(),
}))

import Form from '../src/components/Form/Form.vue'

// ─── T13: UserDetails ref values — R1, R2, R5, R9 ────────────────────
describe('UserDetails-like form — ref values — R1, R2, R5, R9', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    sessionStorage.clear()
  })

  it('test_UserDetails_usernameFormRenders — R1', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const userNameRef = ref<HTMLInputElement | null>(null)

    // Simulate UserDetails's username update form
    const UserDetailsLike = defineComponent({
      setup() {
        return () => h(Form, {
          action: vi.fn(),
          error: false,
          submitValue: 'Update Username',
          fields: [
            { name: 'username', placeholder: 'Username', type: 'text', setRef: (el: any) => userNameRef.value = el, required: true },
          ],
        })
      },
    })

    const wrapper = mount(UserDetailsLike, {
      global: { plugins: [pinia, testI18n] },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.find('input[name="username"]').exists()).toBe(true)
  })

  it('test_UserDetails_usernameRefCapturesValue — R1', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const userNameRef = ref<HTMLInputElement | null>(null)

    const UserDetailsLike = defineComponent({
      setup() {
        return () => h(Form, {
          action: vi.fn(),
          error: false,
          submitValue: 'Update Username',
          fields: [
            { name: 'username', placeholder: 'Username', type: 'text', setRef: (el: any) => userNameRef.value = el, required: true },
          ],
        })
      },
    })

    const wrapper = mount(UserDetailsLike, {
      global: { plugins: [pinia, testI18n] },
    })

    await wrapper.vm.$nextTick()
    await flushPromises()

    await wrapper.find('input[name="username"]').setValue('newusername')
    await wrapper.vm.$nextTick()

    expect(userNameRef.value?.value).toBe('newusername')
  })

  it('test_UserDetails_emailFormRenders — R1', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const emailRef = ref<HTMLInputElement | null>(null)

    const UserDetailsLike = defineComponent({
      setup() {
        return () => h(Form, {
          action: vi.fn(),
          error: false,
          submitValue: 'Update Email',
          fields: [
            { name: 'email', placeholder: 'Email', type: 'email', setRef: (el: any) => emailRef.value = el, required: true },
          ],
        })
      },
    })

    const wrapper = mount(UserDetailsLike, {
      global: { plugins: [pinia, testI18n] },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.find('input[name="email"]').exists()).toBe(true)
  })

  it('test_UserDetails_emailRefCapturesValue — R1', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const emailRef = ref<HTMLInputElement | null>(null)

    const UserDetailsLike = defineComponent({
      setup() {
        return () => h(Form, {
          action: vi.fn(),
          error: false,
          submitValue: 'Update Email',
          fields: [
            { name: 'email', placeholder: 'Email', type: 'email', setRef: (el: any) => emailRef.value = el, required: true },
          ],
        })
      },
    })

    const wrapper = mount(UserDetailsLike, {
      global: { plugins: [pinia, testI18n] },
    })

    await wrapper.vm.$nextTick()
    await flushPromises()

    await wrapper.find('input[name="email"]').setValue('newemail@example.com')
    await wrapper.vm.$nextTick()

    expect(emailRef.value?.value).toBe('newemail@example.com')
  })

  it('test_UserDetails_passwordFormRendersWithTwoFields — R1', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const passRef = ref<HTMLInputElement | null>(null)
    const pass2Ref = ref<HTMLInputElement | null>(null)

    // Simulate UserDetails's password update form
    const UserDetailsLike = defineComponent({
      setup() {
        return () => h(Form, {
          action: vi.fn(),
          error: false,
          submitValue: 'Update Password',
          showPassword: true,
          fields: [
            { name: 'password', placeholder: 'Password', id: 'passwordField', type: 'password', setRef: (el: any) => passRef.value = el, required: true },
            { name: 'password2', placeholder: 'Repeat Password', id: 'passwordTwoField', type: 'password', setRef: (el: any) => pass2Ref.value = el, required: true },
          ],
        })
      },
    })

    const wrapper = mount(UserDetailsLike, {
      global: { plugins: [pinia, testI18n] },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.find('input[name="password"]').exists()).toBe(true)
    expect(wrapper.find('input[name="password2"]').exists()).toBe(true)
  })

  it('test_UserDetails_passwordRefsCaptureValues — R1, R5', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const passRef = ref<HTMLInputElement | null>(null)
    const pass2Ref = ref<HTMLInputElement | null>(null)

    const UserDetailsLike = defineComponent({
      setup() {
        return () => h(Form, {
          action: vi.fn(),
          error: false,
          submitValue: 'Update Password',
          showPassword: true,
          fields: [
            { name: 'password', placeholder: 'Password', id: 'passwordField', type: 'password', setRef: (el: any) => passRef.value = el, required: true },
            { name: 'password2', placeholder: 'Repeat Password', id: 'passwordTwoField', type: 'password', setRef: (el: any) => pass2Ref.value = el, required: true },
          ],
        })
      },
    })

    const wrapper = mount(UserDetailsLike, {
      global: { plugins: [pinia, testI18n] },
    })

    await wrapper.vm.$nextTick()
    await flushPromises()

    await wrapper.find('input[name="password"]').setValue('newpass123')
    await wrapper.find('input[name="password2"]').setValue('newpass123')
    await wrapper.vm.$nextTick()

    expect(passRef.value?.value).toBe('newpass123')
    expect(pass2Ref.value?.value).toBe('newpass123')
  })

  it('test_UserDetails_submitCapturesPasswordRefValues — R2', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const passRef = ref<HTMLInputElement | null>(null)
    const pass2Ref = ref<HTMLInputElement | null>(null)
    const capturedValues: Record<string, string> = {}

    const submitAction = vi.fn((event: Event) => {
      event.preventDefault()
      capturedValues.password = passRef.value?.value || ''
      capturedValues.password2 = pass2Ref.value?.value || ''
    })

    const UserDetailsLike = defineComponent({
      setup() {
        return () => h(Form, {
          action: submitAction,
          error: false,
          submitValue: 'Update Password',
          showPassword: true,
          fields: [
            { name: 'password', placeholder: 'Password', id: 'passwordField', type: 'password', setRef: (el: any) => passRef.value = el, required: true },
            { name: 'password2', placeholder: 'Repeat Password', id: 'passwordTwoField', type: 'password', setRef: (el: any) => pass2Ref.value = el, required: true },
          ],
        })
      },
    })

    const wrapper = mount(UserDetailsLike, {
      global: { plugins: [pinia, testI18n] },
    })

    await wrapper.vm.$nextTick()
    await flushPromises()

    await wrapper.find('input[name="password"]').setValue('securepass456')
    await wrapper.find('input[name="password2"]').setValue('securepass456')
    await wrapper.vm.$nextTick()

    await wrapper.find('form').trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    expect(capturedValues.password).toBe('securepass456')
    expect(capturedValues.password2).toBe('securepass456')
  })

  it('test_UserDetails_colorRefCapturesValue — R1', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const colorRef = ref<HTMLInputElement | null>(null)

    // Simulate UserDetails's color picker input
    const UserDetailsLike = defineComponent({
      setup() {
        return () => h('input', {
          ref: colorRef,
          type: 'color',
          name: 'color',
        })
      },
    })

    const wrapper = mount(UserDetailsLike, {
      global: { plugins: [pinia, testI18n] },
    })

    await wrapper.vm.$nextTick()

    expect(colorRef.value).not.toBeNull()

    // Set color value
    await wrapper.find('input[name="color"]').setValue('#ff5733')
    await wrapper.vm.$nextTick()

    expect(colorRef.value?.value).toBe('#ff5733')
  })

  it('test_UserDetails_imageRefCapturesFile — R1', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const imageRef = ref<HTMLInputElement | null>(null)

    // Simulate UserDetails's image upload input
    const UserDetailsLike = defineComponent({
      setup() {
        return () => h('input', {
          ref: imageRef,
          type: 'file',
          name: 'image',
          accept: 'image/*',
        })
      },
    })

    const wrapper = mount(UserDetailsLike, {
      global: { plugins: [pinia, testI18n] },
    })

    await wrapper.vm.$nextTick()

    expect(imageRef.value).not.toBeNull()
    expect(imageRef.value?.type).toBe('file')
  })

  it('test_UserDetails_allRefsCaptureValuesIndependently — R5', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const userNameRef = ref<HTMLInputElement | null>(null)
    const emailRef = ref<HTMLInputElement | null>(null)
    const passRef = ref<HTMLInputElement | null>(null)
    const pass2Ref = ref<HTMLInputElement | null>(null)

    // Simulate all UserDetails form fields together
    const UserDetailsLike = defineComponent({
      setup() {
        return () => h('div', [
          h(Form, {
            action: vi.fn(),
            submitValue: 'Update Username',
            fields: [
              { name: 'username', placeholder: 'Username', type: 'text', setRef: (el: any) => userNameRef.value = el, required: true },
            ],
          }),
          h(Form, {
            action: vi.fn(),
            submitValue: 'Update Email',
            fields: [
              { name: 'email', placeholder: 'Email', type: 'email', setRef: (el: any) => emailRef.value = el, required: true },
            ],
          }),
          h(Form, {
            action: vi.fn(),
            submitValue: 'Update Password',
            showPassword: true,
            fields: [
              { name: 'password', placeholder: 'Password', id: 'passwordField', type: 'password', setRef: (el: any) => passRef.value = el, required: true },
              { name: 'password2', placeholder: 'Repeat Password', id: 'passwordTwoField', type: 'password', setRef: (el: any) => pass2Ref.value = el, required: true },
            ],
          }),
        ])
      },
    })

    const wrapper = mount(UserDetailsLike, {
      global: { plugins: [pinia, testI18n] },
    })

    await wrapper.vm.$nextTick()
    await flushPromises()

    // Fill all fields across the three forms
    const forms = wrapper.findAll('form')

    // Username form (first form)
    await forms[0].find('input[name="username"]').setValue('testuser')
    // Email form (second form)
    await forms[1].find('input[name="email"]').setValue('test@example.com')
    // Password form (third form)
    await forms[2].find('input[name="password"]').setValue('pass123')
    await forms[2].find('input[name="password2"]').setValue('pass123')
    await wrapper.vm.$nextTick()

    // Verify all refs captured their values independently
    expect(userNameRef.value?.value).toBe('testuser')
    expect(emailRef.value?.value).toBe('test@example.com')
    expect(passRef.value?.value).toBe('pass123')
    expect(pass2Ref.value?.value).toBe('pass123')
  })
})

// ─── T10: UserDetails renders profile update sections — R3, R5 ───────
describe('UserDetails — profile sections rendering — R3, R5', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    sessionStorage.clear()
    vi.clearAllMocks()
  })

  it('test_UserDetails_rendersUsernameUpdateSection — R3, R5', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useAppStore()

    store.setUserLogged({
      id: 1,
      username: 'testuser',
      email: 'test@mail.com',
      image: '',
      countries: [],
      rooms: [],
    })
    store.setXToken('test-token')
    store.setSongs([])

    // Dynamically import to get the mocked router
    const UserDetails = (await import('../src/views/UserDetails/UserDetails.vue')).default

    const wrapper = mount(UserDetails, {
      global: {
        plugins: [pinia, testI18n],
        stubs: {
          'router-link': true,
        },
      },
    })

    await wrapper.vm.$nextTick()
    await flushPromises()

    // Should render the username update collapsible (Spanish locale)
    expect(wrapper.text()).toContain('Cambiar nombre de usuario: ')
  })

  it('test_UserDetails_rendersEmailUpdateSection — R3, R5', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useAppStore()

    store.setUserLogged({
      id: 1,
      username: 'testuser',
      email: 'test@mail.com',
      image: '',
      countries: [],
      rooms: [],
    })
    store.setXToken('test-token')
    store.setSongs([])

    const UserDetails = (await import('../src/views/UserDetails/UserDetails.vue')).default

    const wrapper = mount(UserDetails, {
      global: {
        plugins: [pinia, testI18n],
        stubs: {
          'router-link': true,
        },
      },
    })

    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(wrapper.text()).toContain('Cambiar correo electrónico: ')
  })

  it('test_UserDetails_rendersPasswordUpdateSection — R3, R5', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useAppStore()

    store.setUserLogged({
      id: 1,
      username: 'testuser',
      email: 'test@mail.com',
      image: '',
      countries: [],
      rooms: [],
    })
    store.setXToken('test-token')
    store.setSongs([])

    const UserDetails = (await import('../src/views/UserDetails/UserDetails.vue')).default

    const wrapper = mount(UserDetails, {
      global: {
        plugins: [pinia, testI18n],
        stubs: {
          'router-link': true,
        },
      },
    })

    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(wrapper.text()).toContain('Cambiar contraseña: ')
  })

  it('test_UserDetails_rendersImageUpdateSection — R3, R5', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useAppStore()

    store.setUserLogged({
      id: 1,
      username: 'testuser',
      email: 'test@mail.com',
      image: '',
      countries: [],
      rooms: [],
    })
    store.setXToken('test-token')
    store.setSongs([])

    const UserDetails = (await import('../src/views/UserDetails/UserDetails.vue')).default

    const wrapper = mount(UserDetails, {
      global: {
        plugins: [pinia, testI18n],
        stubs: {
          'router-link': true,
        },
      },
    })

    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(wrapper.text()).toContain('Actualizar avatar: ')
  })

  it('test_UserDetails_rendersAllProfileSections — R3, R5', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useAppStore()

    store.setUserLogged({
      id: 1,
      username: 'testuser',
      email: 'test@mail.com',
      image: '',
      countries: [],
      rooms: [],
    })
    store.setXToken('test-token')
    store.setSongs([])

    const UserDetails = (await import('../src/views/UserDetails/UserDetails.vue')).default

    const wrapper = mount(UserDetails, {
      global: {
        plugins: [pinia, testI18n],
        stubs: {
          'router-link': true,
        },
      },
    })

    await wrapper.vm.$nextTick()
    await flushPromises()

    // All four profile sections should be present (Spanish locale)
    expect(wrapper.text()).toContain('Cambiar nombre de usuario: ')
    expect(wrapper.text()).toContain('Cambiar correo electrónico: ')
    expect(wrapper.text()).toContain('Cambiar contraseña: ')
    expect(wrapper.text()).toContain('Actualizar avatar: ')
  })
})
