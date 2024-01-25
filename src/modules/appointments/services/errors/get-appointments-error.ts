export class GetAppointmentsError extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'GetAppointmentsError'
  }
}
