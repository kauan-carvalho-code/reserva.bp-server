import { type Appointment } from '@prisma/client'

export interface AppointmentRepository {
  create: (appointment: Omit<Appointment, 'id'>) => Promise<Appointment>
  getAppointments: (user_id: string, user_role: string) => Promise<Appointment[]>
  findOverlappingAppointment: (broker_id: string, starts_at: Date, ends_at: Date) => Promise<Appointment | null>
}
