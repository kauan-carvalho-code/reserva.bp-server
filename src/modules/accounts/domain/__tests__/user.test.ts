import { describe, expect, it } from 'vitest'

import { User, type UserAttributes } from '../user'

describe('UserEntity', () => {
  it('should create a user with correct attributes', () => {
    const attributes: UserAttributes = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password',
      role: 'user'
    }

    const user = User.create(attributes)

    expect(user.id).toBeDefined()
    expect(user.name).toBe(attributes.name)
    expect(user.email).toBe(attributes.email)
    expect(user.password).toBe(attributes.password)
    expect(user.role).toBe(attributes.role)
  })
})
