export class CreateAppointmentError extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'CreateAppointmentError'
  }
}
