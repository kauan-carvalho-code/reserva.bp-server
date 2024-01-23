import { describe, it, expect, beforeEach } from 'vitest'

import { type UserRepositoryImpl } from '../../repositories/user-repository-impl'

import { CreateUserUseCase, type CreateUserUseCaseInput } from '../create-user-use-case'

import { InMemoryUserRepository } from '../../../../infrastructure/repositories/in-memory/in-memory-user-repository'

import { UserAlreadyExistsError } from '../errors/user-already-exists-error'

describe('CreateUserUseCase', () => {
  let inMemoryUserRepository: UserRepositoryImpl
  let createUserUseCase: CreateUserUseCase

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository)
  })

  it('should create a user with valid input', async () => {
    const input: CreateUserUseCaseInput = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'securepassword',
      role: 'customer'
    }

    const output = await createUserUseCase.execute(input)

    expect(output).toMatchObject({
      name: input.name,
      email: input.email
    })

    const userInRepository = await inMemoryUserRepository.findByEmail(input.email)

    expect(userInRepository).not.toBeNull()
  })

  it('should return UserAlreadyExistsError for existing email', async () => {
    const existingUser: CreateUserUseCaseInput = {
      name: 'Existing User',
      email: 'existing.user@example.com',
      password: 'existing_password',
      role: 'customer'
    }

    await createUserUseCase.execute(existingUser)

    const input: CreateUserUseCaseInput = {
      name: 'John Doe',
      email: existingUser.email,
      password: 'securepassword',
      role: 'customer'
    }

    const result = await createUserUseCase.execute(input)

    expect(result).toBeInstanceOf(UserAlreadyExistsError)
  })
})
