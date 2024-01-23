import { describe, expect, it } from 'vitest'

import { Password } from '../password'

import { InvalidPasswordLengthError } from '../errors/invalid-password-length-error'

describe('PasswordEntity', () => {
  it('should create a Password instance for valid password', () => {
    const password = Password.create('John Doe')
    expect(password).toBeInstanceOf(Password)
  })

  it('should throw InvalidPasswordLengthError for invalid password', () => {
    const password = Password.create('c'.repeat(256))
    expect(password).toBeInstanceOf(InvalidPasswordLengthError)
  })
})
