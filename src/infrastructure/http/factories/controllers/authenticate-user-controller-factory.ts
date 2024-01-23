import { type Controller } from '../../../../core/controller'

import { AuthenticateUserController } from '../../../../modules/accounts/controllers/authenticate-user-controller'

import { PrismaUserRepository } from '../../../repositories/prisma/prisma-user-repository'

import { AuthenticateUserUseCase } from '../../../../modules/accounts/use-cases/authenticate-user-use-case'

export function makeAutheticateUserController (): Controller {
  const inMemoryUsersRepository = new PrismaUserRepository()

  const authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)

  const authenticateUserController = new AuthenticateUserController(authenticateUserUseCase)

  return authenticateUserController
}
