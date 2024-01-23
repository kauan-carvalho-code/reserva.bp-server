export class InvalidPasswordLengthError extends Error {
  constructor () {
    super('The password must have between 8 and 255 characters.')
    this.name = 'InvalidPasswordLengthError'
  }
}
