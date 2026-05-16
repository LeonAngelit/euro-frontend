// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useAppStore } from '../src/stores/app'
import { testI18n } from './i18nPlugin'

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

import ClassificationView from '../src/components/ClassificationView/ClassificationView.vue'

// ─── T42: ClassificationView user list filtered by min country count (R43) ──
describe('ClassificationView — R43', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('test_ClassificationView_filtersUsersByMinCountryCount — R43', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useAppStore()

    // Set songs with 6+ items so targetCount = 6
    store.setSongs([
      { id: 1, name: 'Country A', code: 'ca' },
      { id: 2, name: 'Country B', code: 'cb' },
      { id: 3, name: 'Country C', code: 'cc' },
      { id: 4, name: 'Country D', code: 'cd' },
      { id: 5, name: 'Country E', code: 'ce' },
      { id: 6, name: 'Country F', code: 'cf' },
    ])

    store.setUserLogged({ id: 1, username: 'test', email: null, image: '', countries: [], rooms: [] })
    store.setXToken('test-token')

    const roomData = {
      name: 'Test Room',
      users: [
        { id: 1, username: 'user1', image: '', countries: [1, 2, 3, 4, 5, 6], total: 6 },
        { id: 2, username: 'user2', image: '', countries: [1, 2, 3], total: 3 },
        { id: 3, username: 'user3', image: '', countries: [1, 2, 3, 4, 5, 6], total: 6 },
      ],
    }

    const wrapper = mount(ClassificationView, {
      props: {
        room: roomData,
      },
      global: {
        plugins: [pinia, testI18n],
      },
    })

    await wrapper.vm.$nextTick()

    // With 6 songs, targetCount = 6, so only users with countries.length >= 6 should appear
    const userCards = wrapper.findAll('.user-card-wrapper')
    // user1 (6 countries) and user3 (6 countries) should be displayed
    // user2 (3 countries) should be filtered out
    expect(userCards.length).toBe(2)
  })

  it('test_ClassificationView_withFiveSongs_correctlyFilters — R43', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useAppStore()

    // Set songs with 5 items so targetCount = 5
    store.setSongs([
      { id: 1, name: 'Country A', code: 'ca' },
      { id: 2, name: 'Country B', code: 'cb' },
      { id: 3, name: 'Country C', code: 'cc' },
      { id: 4, name: 'Country D', code: 'cd' },
      { id: 5, name: 'Country E', code: 'ce' },
    ])

    store.setUserLogged({ id: 1, username: 'test', email: null, image: '', countries: [], rooms: [] })
    store.setXToken('test-token')

    const roomData = {
      name: 'Test Room',
      users: [
        { id: 1, username: 'user1', image: '', countries: [1, 2, 3, 4, 5], total: 5 },
        { id: 2, username: 'user2', image: '', countries: [1, 2], total: 2 },
      ],
    }

    const wrapper = mount(ClassificationView, {
      props: {
        room: roomData,
      },
      global: {
        plugins: [pinia, testI18n],
      },
    })

    await wrapper.vm.$nextTick()

    // With 5 songs, targetCount = 5, so only users with countries.length >= 5 should appear
    const userCards = wrapper.findAll('.user-card-wrapper')
    expect(userCards.length).toBe(1)
  })

  it('test_ClassificationView_displaysRoomName — R43', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useAppStore()

    store.setSongs([
      { id: 1, name: 'Country A', code: 'ca' },
      { id: 2, name: 'Country B', code: 'cb' },
      { id: 3, name: 'Country C', code: 'cc' },
      { id: 4, name: 'Country D', code: 'cd' },
      { id: 5, name: 'Country E', code: 'ce' },
    ])

    store.setUserLogged({ id: 1, username: 'test', email: null, image: '', countries: [], rooms: [] })
    store.setXToken('test-token')

    const wrapper = mount(ClassificationView, {
      props: {
        room: { name: 'My Room', users: [] },
      },
      global: {
        plugins: [pinia, testI18n],
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('My Room')
  })
})