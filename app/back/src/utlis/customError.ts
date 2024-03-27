export default class CustomError extends Error {
  constructor(public code: number, message: string) {
    super(message)
    this.name = 'CustomError'
    Object.setPrototypeOf(this, CustomError.prototype)
  }
}
