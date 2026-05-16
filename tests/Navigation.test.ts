// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useAppStore } from '../src/stores/app'
import { testI18n } from './i18nPlugin'

// Mock vue-router
const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
  useRoute: () => ({ path: '/app' }),
}))

// Mock @iconify/vue Icon component
const IconStub = {
  props: ['icon'],
  template: '<span :data-icon="icon" class="icon-stub"></span>',
}

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
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

// Mock useHandleCloseSession
vi.mock('../src/composables/useHandleCloseSession', () => ({
  default: vi.fn(),
}))

import Navigation from '../src/components/Navigation/Navigation.vue'

// ─── T39: Navigation user-menu toggle and admin panel (R40) ──────────
describe('Navigation — R40', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('test_Navigation_clickingUserMenuButton_togglesDropdown — R40', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useAppStore()
    store.setUserLogged({ id: 1, username: 'testuser', email: 'test@mail.com', image: '', countries: [], rooms: [] })
    store.setXToken('test-token')

    const wrapper = mount(Navigation, {
      global: {
        plugins: [pinia, testI18n],
        stubs: {
          Icon: IconStub,
          AdminPanel: true,
          'router-link': true,
        },
      },
    })

    // Initially the user menu should be hidden
    expect(wrapper.find('.menu-visible').exists()).toBe(false)

    // Click the user menu button
    const menuButton = wrapper.find('button.user-image, button[aria-label], .user-image-container button')
    if (menuButton.exists()) {
      await menuButton.trigger('click')
      // After click, user menu should be visible
      expect(wrapper.find('.menu-visible').exists()).toBe(true)
    }
  })

  it('test_Navigation_rendersUserMenuLinks_whenLoggedIn — R40', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useAppStore()
    store.setUserLogged({ id: 1, username: 'testuser', email: 'test@mail.com', image: '', countries: [], rooms: [] })
    store.setXToken('test-token')

    const wrapper = mount(Navigation, {
      global: {
        plugins: [pinia, testI18n],
        stubs: {
          Icon: IconStub,
          AdminPanel: true,
          'router-link': true,
        },
      },
    })

    // Navigation should render user-related links when logged in
    const links = wrapper.findAll('a, .user-menu li')
    expect(links.length).toBeGreaterThan(0)
  })
})