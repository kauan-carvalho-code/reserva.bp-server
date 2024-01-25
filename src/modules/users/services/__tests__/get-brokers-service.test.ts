import { describe, it, expect, beforeEach, vi } from 'vitest'

import { GetBrokersService } from '../get-brokers-service'

const mockUserRepository = {
  findByEmail: vi.fn(),
  create: vi.fn(),
  findById: vi.fn(),
  getBrokers: vi.fn()
}

describe('GetBrokersService', () => {
  let getBrokersService: GetBrokersService

  beforeEach(() => {
    getBrokersService = new GetBrokersService(mockUserRepository)
  })

  it('should return an array of brokers', async () => {
    mockUserRepository.getBrokers.mockResolvedValue([
      { id: '1', name: 'John Doe', email: 'john.doe@mail.com', role: 'broker' },
      { id: '2', name: 'Jane Doe', email: 'jane.doe@mail.com', role: 'broker' }
    ])

    const result = await getBrokersService.execute()

    expect(result).toBeInstanceOf(Array)

    result.forEach(user => {
      expect(user.role).toBe('broker')
    })
  })
})
