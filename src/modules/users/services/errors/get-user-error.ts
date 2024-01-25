export class GetUserError extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'GetUserError'
  }
}
