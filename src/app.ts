import express from 'express'

import cors from 'cors'

import cookieParser from 'cookie-parser'

import { authRouter } from './modules/auth/routes/auth-routes'
import { userRouter } from './modules/users/routes/user-routes'

const app = express()

app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true
  })
)

app.use(
  express.json({
    type: ['application/json', 'text/plain']
  })
)

app.use(cookieParser())

app.use('/auth', authRouter)
app.use('/users', userRouter)

export { app }
