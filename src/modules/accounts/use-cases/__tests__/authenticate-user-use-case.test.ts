import { describe, it, expect, beforeEach } from 'vitest'

import bcrypt from 'bcrypt'

import { type UserRepositoryImpl } from '../../repositories/user-repository-impl'

import { AuthenticateUserUseCase } from '../authenticate-user-use-case'

import { User } from '../../domain/user'

import { InvalidEmailOrPasswordError } from '../errors/invalid-email-or-password-error'

import { InMemoryUserRepository } from '../../../../infrastructure/repositories/in-memory/in-memory-user-repository'

describe('AuthenticateUserUseCase', () => {
  let inMemoryUserRepository: UserRepositoryImpl
  let authenticateUserUseCase: AuthenticateUserUseCase

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUserRepository)
  })

  it('should authenticate user with valid credentials', async () => {
    const userWithPassword = User.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: await bcrypt.hash('securepassword', 8),
      role: 'customer'
    })

    await inMemoryUserRepository.save(userWithPassword)

    const output = await authenticateUserUseCase.execute({
      email: userWithPassword.email,
      password: 'securepassword'
    })

    expect(output).toEqual(
      expect.objectContaining({ token: expect.any(String) })
    )
  })

  it('should not be able to authenticate with invalid e-mail', async () => {
    const response = await authenticateUserUseCase.execute({
      email: 'invalid@example.com',
      password: '123456'
    })

    expect(response).toEqual(new InvalidEmailOrPasswordError())
  })

  it('should not be able to authenticate with invalid password', async () => {
    const userWithPassword = User.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: await bcrypt.hash('securepassword', 8),
      role: 'customer'
    })

    await inMemoryUserRepository.save(userWithPassword)

    const response = await authenticateUserUseCase.execute({
      email: 'john@doe.com',
      password: 'invalid-password'
    })

    expect(response).toEqual(new InvalidEmailOrPasswordError())
  })
})
