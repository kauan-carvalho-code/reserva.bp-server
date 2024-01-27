import { type Request, type Response } from 'express'

import { type CreateAppointmentService } from '../services/create-appointment-service'
import { type GetAppointmentsService } from '../services/get-appointments-service'

import { HTTP_CODES } from '../../../shared/http-codes'

import { CreateAppointmentError } from '../services/errors/create-appointment-error'
import { GetAppointmentsError } from '../services/errors/get-appointments-error'

export class AppointmentController {
  constructor (
    private readonly createAppointmentService: CreateAppointmentService,
    private readonly getAppointmentsService: GetAppointmentsService
  ) {
    this.createAppointment = this.createAppointment.bind(this)
    this.getAppointments = this.getAppointments.bind(this)
  }

  async createAppointment (request: Request, response: Response) {
    try {
      const { id } = request.user

      const appointment = await this.createAppointmentService.execute({
        customer_id: id,
        ...request.body
      })

      response.status(HTTP_CODES.CREATED).json({ data: appointment })
    } catch (error) {
      if (error instanceof CreateAppointmentError) {
        return response.status(HTTP_CODES.BAD_REQUEST).json({ error: error.message })
      }

      response.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' })
    }
  }

  async getAppointments (request: Request, response: Response) {
    try {
      const { id } = request.user

      const appointments = await this.getAppointmentsService.execute({
        user_id: id
      })

      response.status(HTTP_CODES.CREATED).json({ data: appointments })
    } catch (error) {
      console.log(error)

      if (error instanceof GetAppointmentsError) {
        return response.status(HTTP_CODES.BAD_REQUEST).json({ error: error.message })
      }

      response.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' })
    }
  }
}
