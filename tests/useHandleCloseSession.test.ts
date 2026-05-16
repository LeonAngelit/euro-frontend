// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAppStore } from '../src/stores/app'

// Mock useGetSongs to prevent network calls
vi.mock('../src/composables/useGetSongs', () => ({
  default: vi.fn().mockResolvedValue([]),
}))

import useHandleCloseSession from '../src/composables/useHandleCloseSession'

// ─── T16: useHandleCloseSession (R17) ─────────────────────────────────
describe('useHandleCloseSession — R17', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    sessionStorage.clear()
  })

  it('test_useHandleCloseSession_callsStoreCloseSession — R17', () => {
    const store = useAppStore()
    const closeSessionSpy = vi.spyOn(store, 'closeSession')
    useHandleCloseSession(store)
    expect(closeSessionSpy).toHaveBeenCalledOnce()
  })
})