import { type Appointment } from '@prisma/client'

import { type AppointmentRepository } from './appointment-repository'

import { prisma } from '../../../database/prisma'

export class PrismaAppointmentRepository implements AppointmentRepository {
  async create (appointment: Appointment) {
    const newAppointment = await prisma.appointment.create({
      data: {
        customer_id: appointment.customer_id,
        broker_id: appointment.broker_id,
        starts_at: appointment.starts_at,
        ends_at: appointment.ends_at
      }
    })

    return newAppointment
  }

  async getAppointments (user_id: string, user_role: string) {
    const prismaQuery: any = {
      where: {},
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        broker: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    }

    switch (user_role) {
      case 'customer': {
        prismaQuery.where.customer_id = user_id
        break
      }

      case 'broker': {
        prismaQuery.where.broker_id = user_id
        break
      }

      default: {
        prismaQuery.where = {}
      }
    }

    const appointments = await prisma.appointment.findMany(prismaQuery)

    return appointments
  }

  async findOverlappingAppointment (broker_id: string, starts_at: Date, ends_at: Date) {
    const overlappingAppointment = await prisma.appointment.findFirst({
      where: {
        broker_id,
        OR: [
          {
            starts_at: {
              lte: ends_at
            },
            ends_at: {
              gte: starts_at
            }
          },
          {
            starts_at: {
              gte: starts_at,
              lte: ends_at
            }
          }
        ]
      }
    })

    return overlappingAppointment
  }
}
