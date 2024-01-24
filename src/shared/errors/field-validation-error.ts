export class FieldValidationError extends Error {
  constructor (field: string) {
    super(`Error in field: ${field}`)
    this.name = 'FieldValidationError'
  }
}
