import bcrypt from 'bcrypt'

import { randomUUID } from 'crypto'

import * as yup from 'yup'

import { type UserRepository } from '../repositories/user-repository'

import { type User } from '../models/user'

import { UserAlreadyExistsError } from '../../../shared/errors/user-already-exists-error'
import { FieldValidationError } from '../../../shared/errors/field-validation-error'

export const createUserServiceInputSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  role: yup.string().oneOf(['customer', 'insurance_broker'], 'Invalid role').required('Role is required')
})

export type CreateUserServiceInput = yup.InferType<typeof createUserServiceInputSchema>

export type CreateUserServiceOutput = Promise<User | Error>

export class CreateUserService {
  constructor (private readonly userRepository: UserRepository) {}

  async execute (input: CreateUserServiceInput): CreateUserServiceOutput {
    try {
      await createUserServiceInputSchema.validate(input)
    } catch (error) {
      return new FieldValidationError(error.path)
    }

    const existingUser = await this.userRepository.findByEmail(input.email)

    if (existingUser) {
      return new UserAlreadyExistsError()
    }

    const hashedPassword = await bcrypt.hash(input.password, 8)

    const user: User = {
      id: randomUUID(),
      name: input.name,
      email: input.email,
      password: hashedPassword,
      role: input.role
    }

    await this.userRepository.save(user)

    return user
  }
}
