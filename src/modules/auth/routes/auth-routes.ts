import { Router } from 'express'

import { PrismaUserRepository } from '../../users/repositories/prisma-user-repository'

import { SignInService } from '../services/sign-in-service'
import { CreateUserService } from '../../users/services/create-user-service'

import { AuthController } from '../controllers/auth-controller'

const userRepository = new PrismaUserRepository()

const signInService = new SignInService(userRepository)
const createUserService = new CreateUserService(userRepository)

const authController = new AuthController(signInService, createUserService)

const authRouter = Router()

authRouter.post('/sign-in', authController.signIn)

authRouter.post('/sign-up', authController.signUp)

authRouter.get('/sign-out', authController.signOut)

export { authRouter }
