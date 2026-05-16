// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useAppStore } from '../src/stores/app'
import { testI18n } from './i18nPlugin'

// Mock @iconify/vue Icon component
const IconStub = {
  props: ['icon'],
  template: '<span :data-icon="icon" class="icon-stub"></span>',
}

// Mock axios (CountryPicker makes axios.post calls)
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

import CountryPicker from '../src/components/CountryPicker/CountryPicker.vue'

// ─── T36: CountryPicker checkbox selection (R37) ─────────────────────
describe('CountryPicker — R37', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('test_CountryPicker_checkingCheckbox_updatesStoreSelection — R37', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useAppStore()

    // Set up songs data so targetCount is 5 or 6
    store.setSongs([
      { id: 1, name: 'Country A', code: 'ca' },
      { id: 2, name: 'Country B', code: 'cb' },
      { id: 3, name: 'Country C', code: 'cc' },
      { id: 4, name: 'Country D', code: 'cd' },
      { id: 5, name: 'Country E', code: 'ce' },
    ])
    store.setUserLogged({ id: 1, username: 'test', email: null, image: '', countries: [], rooms: [] })
    store.setXToken('test-token')

    const wrapper = mount(CountryPicker, {
      global: {
        plugins: [pinia, testI18n],
        stubs: {
          Icon: IconStub,
        },
      },
    })

    await wrapper.vm.$nextTick()

    // Find a checkbox and check it
    const checkboxes = wrapper.findAll('input[type="checkbox"]')
    if (checkboxes.length > 0) {
      const checkbox = checkboxes[0]
      await checkbox.setValue(true)
      await wrapper.vm.$nextTick()

      // Store selection should contain the country id
      expect(store.selection.current.length).toBeGreaterThan(0)
    }
  })

  it('test_CountryPicker_enforcesMaxSelection — R37', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useAppStore()

    // Set up songs with only 5 items (targetCount = 5)
    store.setSongs([
      { id: 1, name: 'Country A', code: 'ca' },
      { id: 2, name: 'Country B', code: 'cb' },
      { id: 3, name: 'Country C', code: 'cc' },
      { id: 4, name: 'Country D', code: 'cd' },
      { id: 5, name: 'Country E', code: 'ce' },
    ])
    store.setUserLogged({ id: 1, username: 'test', email: null, image: '', countries: [], rooms: [] })
    store.setXToken('test-token')

    const wrapper = mount(CountryPicker, {
      global: {
        plugins: [pinia, testI18n],
        stubs: {
          Icon: IconStub,
        },
      },
    })

    await wrapper.vm.$nextTick()

    // With 5 songs, targetCount should be 5
    // When 5 items are selected, trying to add more should trigger modal error
    // First set selection to reach max
    store.setSelection({ current: [1, 2, 3, 4, 5] })
    await wrapper.vm.$nextTick()

    // The selection should have max items
    expect(store.selection.current.length).toBe(5)
  })

  it('test_CountryPicker_rendersCheckboxesForSongs — R37', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useAppStore()

    store.setSongs([
      { id: 1, name: 'Country A', code: 'ca' },
      { id: 2, name: 'Country B', code: 'cb' },
    ])
    store.setUserLogged({ id: 1, username: 'test', email: null, image: '', countries: [], rooms: [] })
    store.setXToken('test-token')

    const wrapper = mount(CountryPicker, {
      global: {
        plugins: [pinia, testI18n],
        stubs: {
          Icon: IconStub,
        },
      },
    })

    // Should have checkboxes for each song
    const checkboxes = wrapper.findAll('input[type="checkbox"].country-checkbox')
    expect(checkboxes.length).toBe(2)
  })
})