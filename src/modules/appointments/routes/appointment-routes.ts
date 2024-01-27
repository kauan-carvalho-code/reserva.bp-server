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

/**
 * @swagger
 * tags:
 *   name: Appointments
 * /appointments:
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAppointmentRequest'
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   $ref: '#/components/schemas/AppointmentResponse'
 *
 */
appointmentRouter.post('/', appointmentController.createAppointment)

/**
 * @swagger
 * tags:
 *   name: Appointments
 * /appointments:
 *   get:
 *     summary: Get appointments
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: Appointments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AppointmentResponse'
 *
 */
appointmentRouter.get('/', appointmentController.getAppointments)

export { appointmentRouter }

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateAppointmentRequest:
 *       type: object
 *       properties:
 *         broker_id:
 *           type: string
 *         starts_at:
 *           type: string
 *           format: date-time
 *         ends_at:
 *           type: string
 *           format: date-time
 *       required:
 *         - broker_id
 *         - starts_at
 *         - ends_at
 *
 *     AppointmentResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         customer:
 *           $ref: '#/components/schemas/ResponseUser'
 *         broker:
 *           $ref: '#/components/schemas/ResponseUser'
 *         starts_at:
 *           type: string
 *           format: date-time
 *         ends_at:
 *           type: string
 *           format: date-time
 *
 */
