import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAppStore } from '../src/stores/app'

// Mock axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
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
import useValidateEmail from '../src/composables/useValidateEmail'

const mockAxiosPost = vi.mocked(axios.post)

// ─── T25: useValidateEmail success path (R26) ────────────────────────
describe('useValidateEmail — success path', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    mockAxiosPost.mockReset()
  })

  it('test_useValidateEmail_success_returnsResultTrueWithData — R26', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useAppStore()
    store.setUserLogged({ id: 1, username: 'test', email: null, image: '', countries: [], rooms: [] })
    store.setXToken('test-token')

    const responseData = { message: 'Email updated' }
    mockAxiosPost.mockResolvedValueOnce({ status: 200, data: responseData })

    const result = await useValidateEmail(store, 'valid-token-123')

    expect(result.result).toBe(true)
    expect(result.data).toEqual(responseData)
  })
})

// ─── T26: useValidateEmail empty token (R27) ─────────────────────────
describe('useValidateEmail — empty token', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    mockAxiosPost.mockReset()
  })

  it('test_useValidateEmail_emptyToken_returnsResultFalse — R27', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useAppStore()

    const result = await useValidateEmail(store, '')

    expect(result).toEqual({ result: false, data: null })
    // No HTTP request should have been made
    expect(mockAxiosPost).not.toHaveBeenCalled()
  })

  it('test_useValidateEmail_nullToken_returnsResultFalse — R27', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useAppStore()

    const result = await useValidateEmail(store, null as any)

    expect(result).toEqual({ result: false, data: null })
    expect(mockAxiosPost).not.toHaveBeenCalled()
  })
})

// ─── T26 additional: useValidateEmail error path ──────────────────────
describe('useValidateEmail — error path', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    mockAxiosPost.mockReset()
  })

  it('test_useValidateEmail_error_returnsResultFalseWithErrorMessage', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useAppStore()
    store.setUserLogged({ id: 1, username: 'test', email: null, image: '', countries: [], rooms: [] })
    store.setXToken('test-token')

    mockAxiosPost.mockRejectedValueOnce({
      response: { data: { message: 'Invalid token' } },
    })

    const result = await useValidateEmail(store, 'some-token')

    expect(result.result).toBe(false)
    expect(result.data).toBe('Invalid token')
  })
})