import * as yup from 'yup'

import { type UserRepository } from '../repositories/user-repository'

import { GetUserError } from './errors/get-user-error'

export const getUserServiceInputSchema = yup.object().shape({
  id: yup.string().required()
})

export type GetUserServiceInput = yup.InferType<typeof getUserServiceInputSchema>

export class GetUserService {
  constructor (private readonly userRepository: UserRepository) {}

  async execute (input: GetUserServiceInput) {
    try {
      await getUserServiceInputSchema.validate(input)
    } catch (error) {
      throw new GetUserError(`Error in field: ${error.path}`)
    }

    const user = await this.userRepository.findById(input.id)

    if (!user) {
      throw new GetUserError('User not found.')
    }

    return user
  }
}
