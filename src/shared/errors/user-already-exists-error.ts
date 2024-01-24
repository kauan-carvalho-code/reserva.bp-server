export class UserAlreadyExistsError extends Error {
  constructor () {
    super('This email is already being used by another user. Please choose another email')
    this.name = 'UserAlreadyExistsError'
  }
}
