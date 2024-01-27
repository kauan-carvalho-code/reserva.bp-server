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

/**
* @swagger
* tags:
*   name: Auth
* /auth/sign-in:
*   post:
*     summary: Log into account
*     tags: [Auth]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               email:
*                 type: string
*               password:
*                 type: string
*     responses:
*       200:
*         description: Success
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*
*/
authRouter.post('/sign-in', authController.signIn)

/**
* @swagger
* tags:
*   name: Auth
* /auth/sign-up:
*   post:
*     summary: Register an account
*     tags: [Auth]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/RequestUser'
*     responses:
*       201:
*         description: User created successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 data:
*                   type: object
*                   $ref: '#/components/schemas/ResponseUser'
*
*/
authRouter.post('/sign-up', authController.signUp)

/**
* @swagger
* tags:
*   name: Auth
* /auth/sign-out:
*   get:
*     summary: Log out the account
*     tags: [Auth]
*     responses:
*       200:
*         description: Success
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*
*/
authRouter.get('/sign-out', authController.signOut)

export { authRouter }
