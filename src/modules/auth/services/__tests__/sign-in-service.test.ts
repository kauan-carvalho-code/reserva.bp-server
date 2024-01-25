import { describe, it, expect, beforeEach, vi } from 'vitest'

import bcrypt from 'bcrypt'

import jwt from 'jsonwebtoken'

import { SignInService, type SignInServiceInput } from '../sign-in-service'

import { auth } from '../../../../config/auth'

const mockUserRepository = {
  findByEmail: vi.fn(),
  create: vi.fn(),
  findById: vi.fn(),
  getBrokers: vi.fn()
}

describe('SignInService', () => {
  let signInService: SignInService

  beforeEach(() => {
    signInService = new SignInService(mockUserRepository)
  })

  it('should throw SignInError if user is not found', async () => {
    const validInput: SignInServiceInput = {
      email: 'nonexistent_user@mail.com',
      password: 'valid_password'
    }

    mockUserRepository.findByEmail.mockResolvedValueOnce(null)

    await expect(signInService.execute(validInput)).rejects.toThrowError('Invalid e-mail/password combination.')
  })

  it('should throw SignInError if password does not match', async () => {
    const validInput: SignInServiceInput = {
      email: 'existing_user@mail.com',
      password: 'invalid_password'
    }

    const existingUser = {
      id: '1',
      name: 'Existing User',
      email: 'existing_user@mail.com',
      password: await bcrypt.hash('existing_user_password', 10),
      role: 'customer'
    }

    mockUserRepository.findByEmail.mockResolvedValueOnce(existingUser)

    await expect(signInService.execute(validInput)).rejects.toThrowError('Invalid e-mail/password combination.')
  })

  it('should return a valid token for a successful sign-in', async () => {
    const validInput: SignInServiceInput = {
      email: 'existing_user@mail.com',
      password: 'existing_user_password'
    }

    const existingUser = {
      id: '1',
      name: 'Existing User',
      email: 'existing_user@mail.com',
      password: await bcrypt.hash('existing_user_password', 10),
      role: 'customer'
    }

    mockUserRepository.findByEmail.mockResolvedValueOnce(existingUser)

    const result = await signInService.execute(validInput)

    const decodedToken = jwt.verify(result, auth.secretKey) as { id: string }

    expect(decodedToken).toBeDefined()
    expect(decodedToken.id).toBe(existingUser.id)
  })
})
