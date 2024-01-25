import { describe, it, expect, beforeEach, vi } from 'vitest'

import { GetUserService, type GetUserServiceInput } from '../get-user-service'

const mockUserRepository = {
  findByEmail: vi.fn(),
  create: vi.fn(),
  findById: vi.fn(),
  getBrokers: vi.fn()
}

describe('GetUserService', () => {
  let getUserService: GetUserService

  beforeEach(() => {
    getUserService = new GetUserService(mockUserRepository)
  })

  it('should return an error if user no exists', async () => {
    const input: GetUserServiceInput = {
      id: 'invalid_id'
    }

    mockUserRepository.findById.mockResolvedValueOnce(null)

    await expect(getUserService.execute(input)).rejects.toThrowError('User not found.')
  })

  it('should return an user with valid input', async () => {
    const input: GetUserServiceInput = {
      id: 'valid_id'
    }

    mockUserRepository.findById.mockResolvedValueOnce({ id: 'valid_id' })

    const result = await getUserService.execute(input)

    expect(result).toBeDefined()
    expect(result.id).toBe(input.id)
  })
})
