export class UserAlreadyExistsError extends Error {
  constructor (email: string) {
    super(`The user "${email}" is already registered.`)
    this.name = 'UserAlreadyExistsError'
  }
}
