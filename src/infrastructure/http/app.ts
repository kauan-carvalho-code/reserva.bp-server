import express from 'express'

import cors from 'cors'

import { authRouter } from './routers/auth-router'
import { userRouter } from './routers/user-router'

const app = express()

app.use(
  cors({
    origin: ['http://localhost:5173']
  })
)

app.use(
  express.json({
    type: ['application/json', 'text/plain']
  })
)

app.use('/auth', authRouter)
app.use('/users', userRouter)

export { app }
