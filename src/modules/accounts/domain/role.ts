import { InvalidRoleError } from './errors/invalid-role-error'

export class Role {
  private readonly role: string

  private constructor (role: string) {
    this.role = role
  }

  get value (): string {
    return this.role
  }

  static validate (role: string): boolean {
    const validRoles = ['customer', 'insurance_broker']

    const roleValidation = !role || !validRoles.includes(role)

    if (roleValidation) {
      return false
    }

    return true
  }

  static create (role: string): Role | Error {
    if (!this.validate(role)) {
      return new InvalidRoleError(role)
    }

    return new Role(role)
  }
}
