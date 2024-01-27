import * as yup from 'yup'

import { type UserRepository } from '../../users/repositories/user-repository'

import { type AppointmentRepository } from '../repositories/appointment-repository'

import { CreateAppointmentError } from './errors/create-appointment-error'

export const createAppointmentServiceInputSchema = yup.object().shape({
  customer_id: yup.string().required(),
  broker_id: yup.string().required(),
  starts_at: yup.date().required(),
  ends_at: yup.date().required()
})

export type CreateAppointmentServiceInput = yup.InferType<typeof createAppointmentServiceInputSchema>

export class CreateAppointmentService {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly appointmentRepository: AppointmentRepository
  ) {}

  async execute (input: CreateAppointmentServiceInput) {
    try {
      await createAppointmentServiceInputSchema.validate(input)
    } catch (error) {
      throw new CreateAppointmentError(`Error in field: ${error.path}`)
    }

    const parsedStartsAt = new Date(input.starts_at)

    const parsedEndsAt = new Date(input.ends_at)

    if (parsedStartsAt <= new Date()) {
      throw new CreateAppointmentError('Appointment start time cannot be in the past.')
    }

    if (parsedEndsAt <= parsedStartsAt) {
      throw new CreateAppointmentError('Appointment end time must be after the start time.')
    }

    const timeDifferenceInMilliseconds = parsedEndsAt.getTime() - parsedStartsAt.getTime()

    const timeDifferenceInMinutes = timeDifferenceInMilliseconds / (1000 * 60) // C

    if (timeDifferenceInMinutes < 30 || timeDifferenceInMinutes > 120) {
      throw new CreateAppointmentError('Appointment duration must be between 30 and 120 minutes.')
    }

    const customer = await this.userRepository.findById(input.customer_id)

    if (!customer) {
      throw new CreateAppointmentError('Customer not found.')
    }

    if (customer.role === 'broker') {
      throw new CreateAppointmentError('Customers cannot be brokers.')
    }

    const broker = await this.userRepository.findById(input.broker_id)

    if (!broker) {
      throw new CreateAppointmentError('Broker not found.')
    }

    const overlappingAppointment = await this.appointmentRepository.findOverlappingAppointment(
      input.broker_id,
      parsedStartsAt,
      parsedEndsAt
    )

    if (overlappingAppointment) {
      throw new CreateAppointmentError('Overlapping appointments are not allowed.')
    }

    const appointment = await this.appointmentRepository.create({
      customer_id: input.customer_id,
      broker_id: input.broker_id,
      starts_at: parsedStartsAt,
      ends_at: parsedEndsAt
    })

    return {
      id: appointment.id,
      customer,
      broker,
      starts_at: appointment.starts_at,
      ends_at: appointment.ends_at
    }
  }
}
