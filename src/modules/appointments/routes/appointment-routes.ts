import { Router } from 'express'

import { PrismaUserRepository } from '../../users/repositories/prisma-user-repository'

import { PrismaAppointmentRepository } from '../repositories/prisma-appointment-repository'

import { CreateAppointmentService } from '../services/create-appointment-service'
import { GetAppointmentsService } from '../services/get-appointments-service'

import { AppointmentController } from '../controllers/appointment-controller'

import { EnsureAuthenticatedMiddleware } from '../../auth/middlewares/ensure-authenticated-middleware'

const prismaUserRepository = new PrismaUserRepository()

const prismaAppointmentRepository = new PrismaAppointmentRepository()

const appointmentController = new AppointmentController(
  new CreateAppointmentService(prismaUserRepository, prismaAppointmentRepository),
  new GetAppointmentsService(prismaUserRepository, prismaAppointmentRepository)
)

const ensureAuthenticatedMiddleware = new EnsureAuthenticatedMiddleware()

const appointmentRouter = Router()

appointmentRouter.use(ensureAuthenticatedMiddleware.handle)

appointmentRouter.post('/', appointmentController.createAppointment)

appointmentRouter.get('/', appointmentController.getAppointments)

export { appointmentRouter }
