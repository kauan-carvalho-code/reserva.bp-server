import bcrypt from 'bcrypt'

import jwt from 'jsonwebtoken'

import * as yup from 'yup'

import { type UserRepository } from '../../users/repositories/user-repository'

import { SignInError } from './errors/sign-in-error'

import { auth } from '../../../config/auth'

export const signInServiceInputSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(8).required()
})

export type SignInServiceInput = yup.InferType<typeof signInServiceInputSchema>

export class SignInService {
  constructor (private readonly userRepository: UserRepository) {}

  async execute (input: SignInServiceInput) {
    try {
      await signInServiceInputSchema.validate(input)
    } catch (error) {
      throw new SignInError(`Error in field: ${error.path}`)
    }

    const user = await this.userRepository.findByEmail(input.email)

    if (!user) {
      throw new SignInError('Invalid e-mail/password combination.')
    }

    const matchPassword = await bcrypt.compare(input.password, user.password)

    if (!matchPassword) {
      throw new SignInError('Invalid e-mail/password combination.')
    }

    const token = jwt.sign({ id: user.id }, auth.secretKey, {
      expiresIn: auth.expiresIn
    })

    return token
  }
}
