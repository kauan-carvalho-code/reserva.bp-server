import bcrypt from 'bcrypt'

import jwt from 'jsonwebtoken'

import * as yup from 'yup'

import { type UserRepository } from '../../users/repositories/user-repository'

import { FieldValidationError, InvalidEmailOrPasswordError } from '../../../shared/errors'

import { auth } from '../../../config/auth'

export const signInServiceInputSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required')
})

export type SignInServiceInput = yup.InferType<typeof signInServiceInputSchema>

export type SignInServiceOutput = Promise<string | Error>

export class SignInService {
  constructor (private readonly userRepository: UserRepository) {}

  async execute (input: SignInServiceInput): SignInServiceOutput {
    try {
      await signInServiceInputSchema.validate(input)
    } catch (error) {
      return new FieldValidationError(error.path)
    }

    const user = await this.userRepository.findByEmail(input.email)

    if (!user) {
      return new InvalidEmailOrPasswordError()
    }

    const matchPassword = await bcrypt.compare(input.password, user.password)

    if (!matchPassword) {
      return new InvalidEmailOrPasswordError()
    }

    const token = jwt.sign({ id: user.id, role: user.role }, auth.secretKey, {
      expiresIn: auth.expiresIn
    })

    return token
  }
}
