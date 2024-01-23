import { InvalidNameError } from './errors/invalid-name-error'

export class Name {
  private readonly name: string

  get value (): string {
    return this.name
  }

  private constructor (name: string) {
    this.name = name
  }

  static validate (name: string): boolean {
    const nameValidation = !name || name.trim().length < 2 || name.trim().length > 255

    if (nameValidation) {
      return false
    }

    return true
  }

  static create (name: string): Name | Error {
    if (!this.validate(name)) {
      return new InvalidNameError(name)
    }

    return new Name(name)
  }
}
