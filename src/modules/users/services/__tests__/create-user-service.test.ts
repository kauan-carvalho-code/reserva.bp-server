import { describe, expect, it, beforeEach, vi } from 'vitest'

import { CreateUserService, type CreateUserServiceInput } from '../create-user-service'

import { FieldValidationError, UserAlreadyExistsError } from '../../../../shared/errors'

import { randomUUID } from 'crypto'

const mockUserRepository = vi.hoisted(() => {
  return {
    findByEmail: vi.fn(),
    save: vi.fn()
  }
})

vi.mock('../../repositories/user-repository', () => {
  return {
    findByEmail: mockUserRepository.findByEmail,
    save: mockUserRepository.save
  }
})

describe('CreateUserService', () => {
  let createUserService: CreateUserService

  beforeEach(() => {
    createUserService = new CreateUserService(mockUserRepository)
  })

  it('should create a new user', async () => {
    const input: CreateUserServiceInput = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'customer'
    }

    const output = await createUserService.execute(input)

    expect(output).toMatchObject({
      name: 'John Doe',
      email: 'john@example.com',
      role: 'customer'
    })

    expect(mockUserRepository.save).toHaveBeenCalledWith(expect.objectContaining({
      name: 'John Doe',
      email: 'john@example.com'
    }))
  })

  it('should return UserAlreadyExistsError when trying to create a user with an existing email', async () => {
    const existingUser = {
      id: randomUUID(),
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password456',
      role: 'insurance_broker'
    }

    mockUserRepository.findByEmail.mockImplementation(async () => await Promise.resolve(existingUser))

    const input: CreateUserServiceInput = {
      name: 'John Doe',
      email: 'jane@example.com',
      password: 'password123',
      role: 'customer'
    }

    const output = await createUserService.execute(input)

    expect(output).toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should return FieldValidationError when input data is invalid', async () => {
    const input: CreateUserServiceInput = {
      name: '',
      email: 'invalid-email',
      password: '123',
      role: 'customer'
    }

    const output = await createUserService.execute(input)

    expect(output).toBeInstanceOf(FieldValidationError)
  })
})
