import { describe, it, expect, vi } from 'vitest'
import { validateRegex, validateEmailRegex, validateUserNameRegex } from '../src/utils/regexUtils'
import utils from '../src/utils/regexUtils'

// ─── T1: validateRegex with valid/invalid passwords (R1, R2) ──────────
describe('validateRegex — password validation', () => {
  it('test_validateRegex_validPassword_returnsTrue — R1', () => {
    expect(validateRegex('Password1')).toBe(true)
    expect(validateRegex('Abcdef12')).toBe(true)
    expect(validateRegex('MyP@ssword99')).toBe(true)
  })

  it('test_validateRegex_invalidPassword_returnsFalse — R2', () => {
    // No digit
    expect(validateRegex('Password')).toBe(false)
    // No uppercase
    expect(validateRegex('password1')).toBe(false)
    // No lowercase
    expect(validateRegex('PASSWORD1')).toBe(false)
    // Too short (< 8 chars)
    expect(validateRegex('Abc12')).toBe(false)
  })

  it('test_validateRegex_invalidPassword_invokesCallback — R2', () => {
    const callback = vi.fn()
    validateRegex('short', callback)
    expect(callback).toHaveBeenCalledOnce()
  })

  it('test_validateRegex_validPassword_doesNotInvokeCallback — R2', () => {
    const callback = vi.fn()
    validateRegex('Password1', callback)
    expect(callback).not.toHaveBeenCalled()
  })
})

// ─── T2: validateEmailRegex (R3, R4) ──────────────────────────────────
describe('validateEmailRegex — email validation', () => {
  it('test_validateEmailRegex_validEmail_returnsTrue — R3', () => {
    expect(validateEmailRegex('user@example.com')).toBe(true)
    expect(validateEmailRegex('test.user@domain.org')).toBe(true)
    expect(validateEmailRegex('hello@world.co')).toBe(true)
  })

  it('test_validateEmailRegex_invalidEmail_returnsFalse — R4', () => {
    expect(validateEmailRegex('plainstring')).toBe(false)
    expect(validateEmailRegex('missing@')).toBe(false)
    expect(validateEmailRegex('@missinguser.com')).toBe(false)
  })

  it('test_validateEmailRegex_invalidEmail_invokesCallback — R4', () => {
    const callback = vi.fn()
    validateEmailRegex('invalid', callback)
    expect(callback).toHaveBeenCalledOnce()
  })

  it('test_validateEmailRegex_validEmail_doesNotInvokeCallback — R4', () => {
    const callback = vi.fn()
    validateEmailRegex('user@example.com', callback)
    expect(callback).not.toHaveBeenCalled()
  })
})

// ─── T3: validateUserNameRegex (R5, R6) ───────────────────────────────
describe('validateUserNameRegex — username validation', () => {
  it('test_validateUserNameRegex_validUsername_returnsTrue — R5', () => {
    expect(validateUserNameRegex('user123')).toBe(true)
    expect(validateUserNameRegex('Hello_World')).toBe(true)
    expect(validateUserNameRegex('abcde')).toBe(true) // min length 5
    expect(validateUserNameRegex('abcde1234567890123456')).toBe(true) // max length 25
  })

  it('test_validateUserNameRegex_invalidUsername_returnsFalse — R6', () => {
    // Too short (< 5 chars)
    expect(validateUserNameRegex('abc')).toBe(false)
    // Too long (> 25 chars)
    expect(validateUserNameRegex('abcdefghijklmnopqrstuvwxyz')).toBe(false)
    // Special characters
    expect(validateUserNameRegex('user!name')).toBe(false)
  })

  it('test_validateUserNameRegex_invalidUsername_invokesCallback — R6', () => {
    const callback = vi.fn()
    validateUserNameRegex('abc', callback)
    expect(callback).toHaveBeenCalledOnce()
  })

  it('test_validateUserNameRegex_validUsername_doesNotInvokeCallback — R6', () => {
    const callback = vi.fn()
    validateUserNameRegex('validuser', callback)
    expect(callback).not.toHaveBeenCalled()
  })
})

// ─── T4: callback parameter behavior (R2, R4, R6) ─────────────────────
describe('validateRegex / validateEmailRegex / validateUserNameRegex — callback parameter', () => {
  it('test_validateRegex_noCallback_doesNotThrow — R2', () => {
    expect(() => validateRegex('invalid')).not.toThrow()
  })

  it('test_validateEmailRegex_noCallback_doesNotThrow — R4', () => {
    expect(() => validateEmailRegex('invalid')).not.toThrow()
  })

  it('test_validateUserNameRegex_noCallback_doesNotThrow — R6', () => {
    expect(() => validateUserNameRegex('abc')).not.toThrow()
  })

  it('test_validateRegex_withCallback_valid_noCall — R2', () => {
    const cb = vi.fn()
    validateRegex('Pass123word', cb)
    expect(cb).not.toHaveBeenCalled()
  })

  it('test_validateEmailRegex_withCallback_valid_noCall — R4', () => {
    const cb = vi.fn()
    validateEmailRegex('a@b.co', cb)
    expect(cb).not.toHaveBeenCalled()
  })

  it('test_validateUserNameRegex_withCallback_valid_noCall — R6', () => {
    const cb = vi.fn()
    validateUserNameRegex('valid1', cb)
    expect(cb).not.toHaveBeenCalled()
  })
})

// ─── T5: Default export regex patterns (R1, R3, R5) ──────────────────
describe('default export regex patterns', () => {
  it('test_passwordRegex_matchesExpected — R1', () => {
    expect(utils.passwordRegex.test('Password1')).toBe(true)
    expect(utils.passwordRegex.test('Abcdef12')).toBe(true)
    expect(utils.passwordRegex.test('password1')).toBe(false) // no uppercase
    expect(utils.passwordRegex.test('PASSWORD1')).toBe(false) // no lowercase
    expect(utils.passwordRegex.test('Password')).toBe(false) // no digit
    expect(utils.passwordRegex.test('Abcd1')).toBe(false) // too short
  })

  it('test_emailRegex_matchesExpected — R3', () => {
    expect(utils.emailRegex.test('user@example.com')).toBe(true)
    expect(utils.emailRegex.test('plainstring')).toBe(false)
  })

  it('test_nombreUsuarioRegex_matchesExpected — R5', () => {
    expect(utils.nombreUsuarioRegex.test('valid_user')).toBe(true)
    expect(utils.nombreUsuarioRegex.test('abc')).toBe(false) // too short
    expect(utils.nombreUsuarioRegex.test('user!name')).toBe(false) // special chars
  })
})