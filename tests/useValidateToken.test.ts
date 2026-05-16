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
import useValidateToken from '../src/composables/useValidateToken'

const mockAxiosGet = vi.mocked(axios.get)

// ─── T27: useValidateToken success path (R28) ─────────────────────────
describe('useValidateToken — success path', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    mockAxiosGet.mockReset()
  })

  it('test_useValidateToken_success_returnsTrue — R28', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useAppStore()
    store.setUserLogged({ id: 1, username: 'test', email: null, image: '', countries: [], rooms: [] })
    store.setXToken('test-token')

    mockAxiosGet.mockResolvedValueOnce({ status: 200, data: { isValidToken: true } })

    const result = await useValidateToken(store)

    expect(result).toBe(true)
  })
})

// ─── T28: useValidateToken error path (R29) ────────────────────────────
describe('useValidateToken — error path', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    mockAxiosGet.mockReset()
  })

  it('test_useValidateToken_error_returnsFalse — R29', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useAppStore()
    store.setUserLogged({ id: 1, username: 'test', email: null, image: '', countries: [], rooms: [] })
    store.setXToken('test-token')

    mockAxiosGet.mockRejectedValueOnce(new Error('Network error'))

    const result = await useValidateToken(store)

    expect(result).toBe(false)
  })

  it('test_useValidateToken_non200_returnsFalse — R29', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useAppStore()
    store.setUserLogged({ id: 1, username: 'test', email: null, image: '', countries: [], rooms: [] })
    store.setXToken('test-token')

    mockAxiosGet.mockResolvedValueOnce({ status: 401, data: { isValidToken: false } })

    const result = await useValidateToken(store)

    expect(result).toBe(false)
  })

  it('test_useValidateToken_validTokenFalse_returnsFalse — R29', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useAppStore()
    store.setUserLogged({ id: 1, username: 'test', email: null, image: '', countries: [], rooms: [] })
    store.setXToken('test-token')

    // Even with 200 status, isValidToken is false
    mockAxiosGet.mockResolvedValueOnce({ status: 200, data: { isValidToken: false } })

    const result = await useValidateToken(store)

    expect(result).toBe(false)
  })
})