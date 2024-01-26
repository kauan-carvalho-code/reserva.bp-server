import express from 'express'

import cors from 'cors'

import cookieParser from 'cookie-parser'

import swaggerUi from 'swagger-ui-express'

import { authRouter } from './modules/auth/routes/auth-routes'
import { userRouter } from './modules/users/routes/user-routes'
import { appointmentRouter } from './modules/appointments/routes/appointment-routes'

import { swaggerSpec } from './config/swagger'

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

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }))
app.use('/auth', authRouter)
app.use('/users', userRouter)
app.use('/appointments', appointmentRouter)

export { app }
