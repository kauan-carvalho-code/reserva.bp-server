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

/**
 * @swagger
 * tags:
 *   name: Users
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
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
userRouter.post('/', userController.createUser)

/**
 * @swagger
 * tags:
 *   name: Users
 * /users:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
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
userRouter.get('/', userController.getUser)

/**
 * @swagger
 * tags:
 *   name: Users
 * /users/brokers:
 *   get:
 *     summary: Get an array of brokers
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Brokers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ResponseUser'
 *
 */
userRouter.get('/brokers', userController.getBrokers)

export { userRouter }

/**
 * @swagger
 * components:
 *   schemas:
 *     RequestUser:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - role
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         role:
 *           type: string
 *
 *     ResponseUser:
 *       type: object
 *       properties:
 *          id:
 *            type: string
 *          name:
 *            type: string
 *          email:
 *            type: string
 *          role:
 *            type: string
 *
 */
