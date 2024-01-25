import * as yup from 'yup'

import { type UserRepository } from '../../users/repositories/user-repository'

import { type AppointmentRepository } from '../repositories/appointment-repository'

import { GetAppointmentsError } from './errors/get-appointments-error'

export const getAppointmentsServiceInputSchema = yup.object().shape({
  user_id: yup.string().required()
})

export type GetAppointmentsServiceInput = yup.InferType<typeof getAppointmentsServiceInputSchema>

export class GetAppointmentsService {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly appointmentRepository: AppointmentRepository
  ) {}

  async execute (input: GetAppointmentsServiceInput) {
    try {
      await getAppointmentsServiceInputSchema.validate(input)
    } catch (error) {
      throw new GetAppointmentsError(`Error in field: ${error.path}`)
    }

    const user = await this.userRepository.findById(input.user_id)

    if (!user) {
      throw new GetAppointmentsError('User not found.')
    }

    const appointments = await this.appointmentRepository.getAppointments(user.id, user.role)

    return appointments
  }
}
