// @vitest-environment jsdom

import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'

// Store original window.location
const originalLocation = window.location

beforeAll(() => {
  Object.defineProperty(window, 'location', {
    writable: true,
    value: { href: '' },
  })
})

afterAll(() => {
  Object.defineProperty(window, 'location', {
    writable: true,
    value: originalLocation,
  })
})

import useNavigateWithCallback from '../src/composables/useNavigateWithCallback'

// ─── T17: useNavigateWithCallback with callback_url (R18) ─────────────
describe('useNavigateWithCallback — R18', () => {
  it('test_useNavigateWithCallback_withCallbackUrl_preservesParam — R18', () => {
    const mockPush = vi.fn()
    const router = { push: mockPush } as any
    window.location.href = 'http://localhost/app?callback_url=/join-room/abc'

    useNavigateWithCallback(router, '/login')
    expect(mockPush).toHaveBeenCalledWith('/login?callback_url=/join-room/abc')
  })
})

// ─── T18: useNavigateWithCallback without callback_url (R19) ─────────
describe('useNavigateWithCallback — R19', () => {
  it('test_useNavigateWithCallback_withoutCallbackUrl_navigatesPlain — R19', () => {
    const mockPush = vi.fn()
    const router = { push: mockPush } as any
    window.location.href = 'http://localhost/app'

    useNavigateWithCallback(router, '/login')
    expect(mockPush).toHaveBeenCalledWith('/login')
  })
})