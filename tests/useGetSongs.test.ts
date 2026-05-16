import { describe, it, expect, vi, beforeEach } from 'vitest'

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
import getSongs from '../src/composables/useGetSongs'

const mockAxiosGet = vi.mocked(axios.get)

// ─── T21: useGetSongs success path (R22) ─────────────────────────────
describe('useGetSongs — success path', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAxiosGet.mockReset()
  })

  it('test_useGetSongs_success_returnsDataArray — R22', async () => {
    const songsData = [
      { id: 1, name: 'Country A', code: 'ca' },
      { id: 2, name: 'Country B', code: 'cb' },
    ]
    mockAxiosGet.mockResolvedValueOnce({ status: 200, data: songsData })

    const result = await getSongs('test-token')

    expect(result).toEqual(songsData)
    expect(mockAxiosGet).toHaveBeenCalledWith(
      'http://test-api/countries',
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: 'application/json',
          Bearer: 'test-token',
        }),
      }),
    )
  })
})

// ─── T22: useGetSongs error path (R23) ───────────────────────────────
describe('useGetSongs — error path', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAxiosGet.mockReset()
  })

  it('test_useGetSongs_error_returnsEmptyArray — R23', async () => {
    mockAxiosGet.mockRejectedValueOnce(new Error('Network error'))

    const result = await getSongs('test-token')

    expect(result).toEqual([])
  })

  it('test_useGetSongs_non200_returnsEmptyArray — R23', async () => {
    mockAxiosGet.mockResolvedValueOnce({ status: 404, data: 'Not found' })

    const result = await getSongs('test-token')

    expect(result).toEqual([])
  })
})