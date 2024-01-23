import { describe, expect, it } from 'vitest'

import { Email } from '../email'

import { InvalidEmailError } from '../errors/invalid-email-error'

describe('EmailEntity', () => {
  it('should create a Email instance for valid email', () => {
    const email = Email.create('john.doe@mail.com')
    expect(email).toBeInstanceOf(Email)
  })

  it('should throw InvalidEmailError for invalid email', () => {
    const email = Email.create('invalid_mail')
    expect(email).toBeInstanceOf(InvalidEmailError)
  })
})
