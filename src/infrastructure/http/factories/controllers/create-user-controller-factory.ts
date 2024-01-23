import { type Controller } from '../../../../core/controller'

import { CreateUserController } from '../../../../modules/accounts/controllers/create-user-controller'

import { PrismaUserRepository } from '../../../repositories/prisma/prisma-user-repository'

import { CreateUserUseCase } from '../../../../modules/accounts/use-cases/create-user-use-case'

export function makeCreateUserController (): Controller {
  const inMemoryUsersRepository = new PrismaUserRepository()

  const createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)

  const createUserController = new CreateUserController(createUserUseCase)

  return createUserController
}
