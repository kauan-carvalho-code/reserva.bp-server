import bcrypt from 'bcrypt'

import { User } from '../domain/user'
import { Name } from '../domain/name'
import { Password } from '../domain/password'
import { Email } from '../domain/email'
import { Role } from '../domain/role'

import { type UserRepositoryImpl } from '../repositories/user-repository-impl'

import { UserAlreadyExistsError } from './errors/user-already-exists-error'

export interface CreateUserUseCaseInput {
  name: string
  email: string
  password: string
  role: string
}

export interface CreateUserUseCaseOutput {
  id: string
  name: string
  email: string
}

export class CreateUserUseCase {
  constructor (private readonly userRepository: UserRepositoryImpl) {}

  async execute (input: CreateUserUseCaseInput): Promise<CreateUserUseCaseOutput | Error> {
    const userAlreadyExists = await this.userRepository.findByEmail(input.email)

    if (userAlreadyExists) {
      return new UserAlreadyExistsError(input.email)
    }

    const name = Name.create(input.name)

    if (name instanceof Error) {
      return name
    }

    const email = Email.create(input.email)

    if (email instanceof Error) {
      return email
    }

    const password = Password.create(input.password)

    if (password instanceof Error) {
      return password
    }

    const role = Role.create(input.role)

    if (role instanceof Error) {
      return role
    }

    const passwordHashed = await bcrypt.hash(input.password, 8)

    const user = User.create({
      name: name.value,
      email: email.value,
      password: passwordHashed,
      role: role.value
    })

    await this.userRepository.save(user)

    return {
      id: user.id,
      name: user.name,
      email: user.email
    }
  }
}
