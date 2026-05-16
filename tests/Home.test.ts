// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { ref, nextTick } from 'vue'
import { testI18n } from './i18nPlugin'

// Mock vue-router
const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush }),
  useRoute: () => ({ path: '/app' }),
}))

// Mock FontAwesomeIcon
vi.mock('@fortawesome/vue-fontawesome', () => ({
  FontAwesomeIcon: {
    props: ['icon'],
    template: '<span :data-icon="icon" />',
  },
}))

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

// Mock composables
vi.mock('../src/composables/useGetSongs', () => ({
  default: vi.fn().mockResolvedValue([]),
}))

vi.mock('../src/composables/useHandleCloseSession', () => ({
  default: vi.fn(),
}))

vi.mock('../src/composables/useValidateToken', () => ({
  default: vi.fn().mockResolvedValue(true),
}))

vi.mock('../src/composables/useNavigateWithCallback', () => ({
  default: vi.fn(),
}))

vi.mock('../src/composables/useUpdateUserData', () => ({
  default: vi.fn(),
}))

import { useAppStore } from '../src/stores/app'
import useNavigateWithCallback from '../src/composables/useNavigateWithCallback'
import Home from '../src/views/App/Home.vue'

// ─── T8: Home redirect to country-select when insufficient countries — R1, R4 ──
describe('Home — redirect to country-select — R1, R4', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    sessionStorage.clear()
    vi.clearAllMocks()
    // Reset window.location pathname
    window.history.pushState({}, '', '/app')
  })

  it('test_Home_redirectsToCountrySelect_whenUserHasInsufficientCountries — R1, R4', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useAppStore()

    // Set user logged in with no countries selected
    store.setUserLogged({
      id: 1,
      username: 'testuser',
      email: 'test@mail.com',
      image: '',
      countries: [],
      rooms: [],
    })
    store.setXToken('test-token')

    // Songs are not loaded yet — redirect should NOT fire (R4)
    const wrapper = mount(Home, {
      global: {
        plugins: [pinia, testI18n],
        stubs: {
          'router-link': true,
        },
      },
    })

    await wrapper.vm.$nextTick()

    // Before songs load, navigateWithCallback should NOT have been called for country-select
    // (the guard in the watch checks songs.length === 0 and returns early)
    const callsBeforeSongs = (useNavigateWithCallback as any).mock.calls.filter(
      (c: any[]) => c[1] && c[1].includes('country-select'),
    )
    expect(callsBeforeSongs.length).toBe(0)

    // Now simulate songs being loaded (more than 5, so targetCount = 6)
    store.setSongs(new Array(10).fill(null).map((_, i) => ({ id: i, name: `Song ${i}` })))
    await wrapper.vm.$nextTick()
    await flushPromises()

    // Now the redirect should have been triggered
    const callsAfterSongs = (useNavigateWithCallback as any).mock.calls.filter(
      (c: any[]) => c[1] && c[1].includes('country-select'),
    )
    expect(callsAfterSongs.length).toBeGreaterThan(0)
  })

  it('test_Home_doesNotRedirectBeforeSongsLoad — R4', async () => {
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

    const wrapper = mount(Home, {
      global: {
        plugins: [pinia, testI18n],
        stubs: {
          'router-link': true,
        },
      },
    })

    await wrapper.vm.$nextTick()

    // Without songs loaded, the redirect guard should prevent navigation
    const countrySelectCalls = (useNavigateWithCallback as any).mock.calls.filter(
      (c: any[]) => c[1] && c[1].includes('country-select'),
    )
    expect(countrySelectCalls.length).toBe(0)
  })
})

// ─── T9: Home shows room picker when user has enough countries — R2 ──
describe('Home — room picker visible — R2', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    sessionStorage.clear()
    vi.clearAllMocks()
    window.history.pushState({}, '', '/app')
  })

  it('test_Home_showsRoomPicker_whenUserHasEnoughCountries — R2', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useAppStore()

    // User with enough countries selected (>= 6 when songs.length > 5)
    store.setUserLogged({
      id: 1,
      username: 'testuser',
      email: 'test@mail.com',
      image: '',
      countries: new Array(6).fill(null).map((_, i) => ({ id: i, name: `Country ${i}` })),
      rooms: [],
    })
    store.setXToken('test-token')

    // Load songs (> 5 so targetCount = 6)
    store.setSongs(new Array(10).fill(null).map((_, i) => ({ id: i, name: `Song ${i}` })))

    const wrapper = mount(Home, {
      global: {
        plugins: [pinia, testI18n],
        stubs: {
          'router-link': true,
        },
      },
    })

    await wrapper.vm.$nextTick()
    await flushPromises()

    // The room picker section should be visible
    const roomsOptions = wrapper.find('.rooms-options')
    expect(roomsOptions.exists()).toBe(true)

    // Should show the "select a room" text (in Spanish since locale is 'es')
    expect(wrapper.text()).toContain('Selecciona una sala')
  })

  it('test_Home_doesNotRedirect_whenUserHasEnoughCountries — R2', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useAppStore()

    store.setUserLogged({
      id: 1,
      username: 'testuser',
      email: 'test@mail.com',
      image: '',
      countries: new Array(6).fill(null).map((_, i) => ({ id: i, name: `Country ${i}` })),
      rooms: [],
    })
    store.setXToken('test-token')
    store.setSongs(new Array(10).fill(null).map((_, i) => ({ id: i, name: `Song ${i}` })))

    const wrapper = mount(Home, {
      global: {
        plugins: [pinia, testI18n],
        stubs: {
          'router-link': true,
        },
      },
    })

    await wrapper.vm.$nextTick()
    await flushPromises()

    // Should NOT redirect to country-select
    const countrySelectCalls = (useNavigateWithCallback as any).mock.calls.filter(
      (c: any[]) => c[1] && c[1].includes('country-select'),
    )
    expect(countrySelectCalls.length).toBe(0)
  })
})
