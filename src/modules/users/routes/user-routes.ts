import { Router } from 'express'

import { PrismaUserRepository } from '../repositories/prisma-user-repository'

import { CreateUserService } from '../services/create-user-service'

import { UserController } from '../controllers/user-controller'

const userRepository = new PrismaUserRepository()

const createUserService = new CreateUserService(userRepository)

const userController = new UserController(createUserService)

const userRouter = Router()

userRouter.post('/', userController.createUser)

export { userRouter }
