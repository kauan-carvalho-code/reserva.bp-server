import { type UserRepository } from '../repositories/user-repository'

export class GetBrokersService {
  constructor (private readonly userRepository: UserRepository) {}

  async execute () {
    const users = await this.userRepository.getBrokers()

    return users
  }
}
