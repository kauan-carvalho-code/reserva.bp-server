import { describe, it, beforeEach, expect, vi } from 'vitest'

import { GetAppointmentsService, type GetAppointmentsServiceInput } from '../get-appointments-service'

const mockUserRepository = {
  findByEmail: vi.fn(),
  create: vi.fn(),
  findById: vi.fn(),
  getBrokers: vi.fn()
}

const mockAppointmentRepository = {
  getAppointments: vi.fn(),
  findOverlappingAppointment: vi.fn(),
  create: vi.fn()
}

describe('GetAppointmentsService', () => {
  let getAppointmentsService: GetAppointmentsService

  beforeEach(() => {
    getAppointmentsService = new GetAppointmentsService(mockUserRepository, mockAppointmentRepository)
  })

  it('should throw GetAppointmentsError if user is not found', async () => {
    const validInput: GetAppointmentsServiceInput = {
      user_id: 'nonexistent_user_id'
    }

    mockUserRepository.findById.mockResolvedValueOnce(null)

    await expect(getAppointmentsService.execute(validInput)).rejects.toThrowError('User not found.')
  })

  it('should get appointments successfully', async () => {
    const validInput: GetAppointmentsServiceInput = {
      user_id: 'existing_user_id'
    }

    const existingUser = {
      id: 'existing_user_id',
      name: 'Existing User',
      email: 'existing_user@mail.com',
      role: 'customer'
    }

    const mockAppointments = [
      {
        id: 'valid_id',
        starts_at: '2024-02-11T16:30:00.000Z',
        ends_at: '2024-02-11T17:00:00.000Z',
        customer_id: 'valid_customer_id',
        broker_id: 'valid_broker_id',
        customer: {
          id: 'valid_customer_id',
          name: 'John Doe',
          email: 'john.doe@mail.com',
          role: 'customer'
        },
        broker: {
          id: 'valid_broker_id',
          name: 'Jane Doe',
          email: 'jane.doe@mail.com',
          role: 'broker'
        }
      }
    ]

    mockUserRepository.findById.mockResolvedValueOnce(existingUser)
    mockAppointmentRepository.getAppointments.mockResolvedValueOnce(mockAppointments)

    const result = await getAppointmentsService.execute(validInput)

    expect(result).toBe(mockAppointments)
  })
})
