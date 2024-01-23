import { InvalidPasswordLengthError } from './errors/invalid-password-length-error'

export class Password {
  private readonly password: string

  get value (): string {
    return this.password
  }

  private constructor (password: string) {
    this.password = password
  }

  static validate (password: string): boolean {
    const passwordValidation = !password || password.trim().length < 8 || password.trim().length > 255

    if (passwordValidation) {
      return false
    }

    return true
  }

  static create (password: string): Password | Error {
    if (!this.validate(password)) {
      return new InvalidPasswordLengthError()
    }

    return new Password(password)
  }
}
