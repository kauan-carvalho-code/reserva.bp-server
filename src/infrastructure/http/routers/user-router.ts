import express from 'express'

import { adaptRoute } from '../../adapters/express-router-adapter'

import { makeCreateUserController } from '../factories/controllers/create-user-controller-factory'

import { adaptMiddleware } from '../../adapters/express-middleware-adapter'

import { makeEnsureAuthenticatedMiddleware } from '../factories/middlewares/ensure-authenticated-middleware-factory'

const userRouter = express.Router()

userRouter.use(adaptMiddleware(makeEnsureAuthenticatedMiddleware()))

userRouter.post('/', adaptRoute(makeCreateUserController()))

export { userRouter }
