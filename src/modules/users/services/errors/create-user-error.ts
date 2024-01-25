export class CreateUserError extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'CreateUserError'
  }
}
