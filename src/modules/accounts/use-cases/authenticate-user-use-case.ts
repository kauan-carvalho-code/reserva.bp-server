import bcrypt from 'bcrypt'

import jwt from 'jsonwebtoken'

import { type UserRepositoryImpl } from '../repositories/user-repository-impl'

import { InvalidEmailOrPasswordError } from './errors/invalid-email-or-password-error'

import { auth } from '../../../config/auth'

export interface AuthenticateUserUseCaseInput {
  email: string
  password: string
}

export interface AuthenticateUserUseCaseOutput {
  token: string
}

export class AuthenticateUserUseCase {
  constructor (private readonly userRepository: UserRepositoryImpl) {}

  async execute (input: AuthenticateUserUseCaseInput): Promise<AuthenticateUserUseCaseOutput | Error> {
    const user = await this.userRepository.findByEmail(input.email)

    if (!user) {
      return new InvalidEmailOrPasswordError()
    }

    const matchPassword = await bcrypt.compare(input.password, user.password)

    if (!matchPassword) {
      return new InvalidEmailOrPasswordError()
    }

    const token = jwt.sign({ role: user.role }, auth.secretKey, {
      subject: user.id,
      expiresIn: auth.expiresIn
    })

    return { token }
  }
}
