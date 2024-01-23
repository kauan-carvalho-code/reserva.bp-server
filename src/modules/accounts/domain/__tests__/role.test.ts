import { describe, expect, it } from 'vitest'

import { Role } from '../role'

import { InvalidRoleError } from '../errors/invalid-role-error'

describe('RoleEntity', () => {
  it('should validate valid roles', () => {
    expect(Role.validate('customer')).toBe(true)
    expect(Role.validate('insurance_broker')).toBe(true)
  })

  it('should invalidate invalid role', () => {
    expect(Role.validate('admin')).toBe(false)
  })

  it('should create a Role instance for valid roles', () => {
    const role = Role.create('customer')
    expect(role).toBeInstanceOf(Role)
  })

  it('should throw InvalidRoleError for invalid roles', () => {
    const role = Role.create('invalid')
    expect(role).toBeInstanceOf(InvalidRoleError)
  })
})
