import { describe, it, expect, beforeEach, vi } from 'vitest'

import { CreateUserService, type CreateUserServiceInput } from '../create-user-service'

const mockUserRepository = {
  findByEmail: vi.fn(),
  create: vi.fn(),
  findById: vi.fn(),
  getBrokers: vi.fn()
}

describe('CreateUserService', () => {
  let createUserService: CreateUserService

  beforeEach(() => {
    createUserService = new CreateUserService(mockUserRepository)
  })

  it('should return an error if user already exists', async () => {
    const input: CreateUserServiceInput = {
      name: 'Existing User',
      email: 'existing_user@mail.com',
      password: 'existing_user_password',
      role: 'customer'
    }

    mockUserRepository.findByEmail.mockResolvedValueOnce(input)

    await expect(createUserService.execute(input)).rejects.toThrowError('User already exists.')
  })

  it('should create an user with valid input', async () => {
    const input: CreateUserServiceInput = {
      name: 'Valid User',
      email: 'valid_user@mail.com',
      password: 'valid_user_password',
      role: 'customer'
    }

    mockUserRepository.create.mockResolvedValueOnce(input)

    const result = await createUserService.execute(input)

    expect(result).toBeDefined()
    expect(result.name).toBe(input.name)
    expect(result.email).toBe(input.email)
    expect(result.name).toBe(input.name)
  })
})
