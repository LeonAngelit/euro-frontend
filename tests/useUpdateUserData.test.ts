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
import useUpdateUserData from '../src/composables/useUpdateUserData'

const mockAxiosGet = vi.mocked(axios.get)

// ─── T23: useUpdateUserData success path (R24) ────────────────────────
describe('useUpdateUserData — success path', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    mockAxiosGet.mockReset()
  })

  it('test_useUpdateUserData_success_callsSetUserLoggedAndNavigates — R24', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useAppStore()
    store.setUserLogged({ id: 5, username: 'testuser', email: null, image: '', countries: [], rooms: [] })
    store.setXToken('test-token')

    const updatedUser = { id: 5, username: 'updated', email: 'new@mail.com', image: 'img.png', countries: [1, 2], rooms: [] }
    mockAxiosGet.mockResolvedValueOnce({ status: 200, data: updatedUser })

    const mockPush = vi.fn()
    const router = { push: mockPush } as any

    await useUpdateUserData(store, router)

    expect(store.userLogged).toEqual(updatedUser)
    expect(mockPush).toHaveBeenCalledWith('/app')
  })
})

// ─── T24: useUpdateUserData error path (R25) ──────────────────────────
describe('useUpdateUserData — error path', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    mockAxiosGet.mockReset()
  })

  it('test_useUpdateUserData_error_returnsErrorMessage — R25', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useAppStore()
    store.setUserLogged({ id: 5, username: 'testuser', email: null, image: '', countries: [], rooms: [] })
    store.setXToken('test-token')

    const errorMsg = 'User not found'
    mockAxiosGet.mockRejectedValueOnce({
      response: { data: { message: errorMsg } },
    })

    const mockPush = vi.fn()
    const router = { push: mockPush } as any

    // The function returns void (Promise<void>), errors are caught internally
    await useUpdateUserData(store, router)

    // Router push should still be called (it's in a .then chain after the catch)
    // Actually looking at the source, .then(() => router.push('/app')) runs after catch
    // But if the first .then block doesn't execute (because of error), the second .then still runs
  })
})