import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAppStore } from '../src/stores/app'

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  },
}))

// Mock config
vi.mock('../src/config/config', () => ({
  default: {
    baseUrl: 'http://test-api/',
    appAdmin: 'admin',
    authP: 'test-auth-p',
    key: 'test-key',
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

import axios from 'axios'
import useGetAuthToken from '../src/composables/useGetAuthToken'

const mockAxiosGet = vi.mocked(axios.get)

// ─── T19: useGetAuthToken success path (R20) ──────────────────────────
describe('useGetAuthToken — success path', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    mockAxiosGet.mockReset()
  })

  it('test_useGetAuthToken_success_storesTokenAndReturnsIt — R20', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useAppStore()
    const token = 'auth-token-123'
    mockAxiosGet.mockResolvedValueOnce({ status: 200, data: token })

    const result = await useGetAuthToken(store)

    expect(result).toBe(token)
    expect(store.xToken).toBe(token)
  })
})

// ─── T20: useGetAuthToken error path (R21) ────────────────────────────
describe('useGetAuthToken — error path', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    mockAxiosGet.mockReset()
  })

  it('test_useGetAuthToken_error_returnsNull — R21', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useAppStore()
    mockAxiosGet.mockRejectedValueOnce(new Error('Network error'))

    const result = await useGetAuthToken(store)

    expect(result).toBe(null)
    // xToken should NOT be modified (remains default empty string)
    expect(store.xToken).toBe('')
  })

  it('test_useGetAuthToken_non200_returnsNull — R21', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useAppStore()
    mockAxiosGet.mockResolvedValueOnce({ status: 401, data: 'unauthorized' })

    const result = await useGetAuthToken(store)

    expect(result).toBe(null)
  })
})