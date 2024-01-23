export class InvalidRoleError extends Error {
  constructor (role: string) {
    super(`The role "${role}" is invalid.`)
    this.name = 'InvalidRoleError'
  }
}
