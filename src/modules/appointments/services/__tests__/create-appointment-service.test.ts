import { describe, it, beforeEach, expect, vi } from 'vitest'

import { CreateAppointmentService, type CreateAppointmentServiceInput } from '../create-appointment-service'

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

describe('CreateAppointmentService', () => {
  let createAppointmentService: CreateAppointmentService

  beforeEach(() => {
    createAppointmentService = new CreateAppointmentService(mockUserRepository, mockAppointmentRepository)
  })

  it('should return an error if customer_id is not found', async () => {
    mockUserRepository.findById.mockResolvedValueOnce(null)

    const input: CreateAppointmentServiceInput = {
      customer_id: 'invalid_customer_id',
      broker_id: 'broker_id',
      starts_at: new Date('2099-01-01T10:00:00'),
      ends_at: new Date('2099-01-01T10:30:00')
    }

    await expect(createAppointmentService.execute(input))
      .rejects.toThrowError('Customer not found.')
  })

  it('should return an error if broker_id is not found', async () => {
    mockUserRepository.findById.mockResolvedValueOnce({ id: 'customer_id', name: 'Customer Name', role: 'customer' })
    mockUserRepository.findById.mockResolvedValueOnce(null)

    const input: CreateAppointmentServiceInput = {
      customer_id: 'customer_id',
      broker_id: 'invalid_broker_id',
      starts_at: new Date('2099-01-01T10:00:00'),
      ends_at: new Date('2099-01-01T10:30:00')
    }

    await expect(createAppointmentService.execute(input))
      .rejects.toThrowError('Broker not found.')
  })

  it('should return an error if there is an overlapping appointment', async () => {
    mockUserRepository.findById.mockResolvedValueOnce({ id: 'customer_id', name: 'Customer Name', role: 'customer' })
    mockUserRepository.findById.mockResolvedValueOnce({ id: 'broker_id', name: 'Broker Name', role: 'broker' })
    mockAppointmentRepository.findOverlappingAppointment.mockResolvedValueOnce({ id: 'overlapping_appointment_id' })

    const input: CreateAppointmentServiceInput = {
      customer_id: 'customer_id',
      broker_id: 'broker_id',
      starts_at: new Date('2099-01-01T10:00:00'),
      ends_at: new Date('2099-01-01T10:30:00')
    }

    await expect(createAppointmentService.execute(input))
      .rejects.toThrowError('Overlapping appointments are not allowed.')
  })

  it('should return an error if appointment duration is less than 30 minutes', async () => {
    mockUserRepository.findById.mockResolvedValueOnce({ id: 'customer_id', name: 'Customer Name', role: 'customer' })
    mockUserRepository.findById.mockResolvedValueOnce({ id: 'broker_id', name: 'Broker Name', role: 'broker' })
    mockAppointmentRepository.findOverlappingAppointment.mockResolvedValueOnce(null)

    const input: CreateAppointmentServiceInput = {
      customer_id: 'customer_id',
      broker_id: 'broker_id',
      starts_at: new Date('2099-01-01T10:00:00'),
      ends_at: new Date('2099-01-01T10:20:00')
    }

    await expect(createAppointmentService.execute(input))
      .rejects.toThrowError('Appointment duration must be between 30 and 120 minutes.')
  })

  it('should return an error if appointment duration is greater than 120 minutes', async () => {
    mockUserRepository.findById.mockResolvedValueOnce({ id: 'customer_id', name: 'Customer Name', role: 'customer' })
    mockUserRepository.findById.mockResolvedValueOnce({ id: 'broker_id', name: 'Broker Name', role: 'broker' })
    mockAppointmentRepository.findOverlappingAppointment.mockResolvedValueOnce(null)

    const input: CreateAppointmentServiceInput = {
      customer_id: 'customer_id',
      broker_id: 'broker_id',
      starts_at: new Date('2099-01-01T10:00:00'),
      ends_at: new Date('2099-01-02T10:00:00')
    }

    await expect(createAppointmentService.execute(input))
      .rejects.toThrowError('Appointment duration must be between 30 and 120 minutes.')
  })
})
