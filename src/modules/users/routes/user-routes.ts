import { Router } from 'express'

import { PrismaUserRepository } from '../repositories/prisma-user-repository'

import { CreateUserService } from '../services/create-user-service'
import { GetUserService } from '../services/get-user-service'
import { GetBrokersService } from '../services/get-brokers-service'

import { UserController } from '../controllers/user-controller'

import { EnsureAuthenticatedMiddleware } from '../../auth/middlewares/ensure-authenticated-middleware'

const userRepository = new PrismaUserRepository()

const userController = new UserController(
  new CreateUserService(userRepository),
  new GetUserService(userRepository),
  new GetBrokersService(userRepository)
)

const ensureAuthenticatedMiddleware = new EnsureAuthenticatedMiddleware()

const userRouter = Router()

userRouter.use(ensureAuthenticatedMiddleware.handle)

userRouter.post('/', userController.createUser)

userRouter.get('/', userController.getUser)

userRouter.get('/brokers', userController.getBrokers)

export { userRouter }
