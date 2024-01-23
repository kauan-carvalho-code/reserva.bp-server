import express from 'express'

import { adaptRoute } from '../../adapters/express-router-adapter'

import { makeAutheticateUserController } from '../factories/controllers/authenticate-user-controller-factory'

import { makeCreateUserController } from '../factories/controllers/create-user-controller-factory'

const authRouter = express.Router()

authRouter.post('/sign-in', adaptRoute(makeAutheticateUserController()))

authRouter.post('/sign-up', adaptRoute(makeCreateUserController()))

export { authRouter }
