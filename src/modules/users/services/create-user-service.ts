import bcrypt from 'bcrypt'

import * as yup from 'yup'

import { type UserRepository } from '../repositories/user-repository'

import { CreateUserError } from './errors/create-user-error'

export const createUserServiceInputSchema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
  role: yup.string().oneOf(['customer', 'broker']).required()
})

export type CreateUserServiceInput = yup.InferType<typeof createUserServiceInputSchema>

export class CreateUserService {
  constructor (private readonly userRepository: UserRepository) {}

  async execute (input: CreateUserServiceInput) {
    try {
      await createUserServiceInputSchema.validate(input)
    } catch (error) {
      throw new CreateUserError(`Error in field: ${error.path}`)
    }

    const existingUser = await this.userRepository.findByEmail(input.email)

    if (existingUser) {
      throw new CreateUserError('User already exists.')
    }

    const hashedPassword = await bcrypt.hash(input.password, 8)

    const user = await this.userRepository.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
      role: input.role
    })

    return user
  }
}
