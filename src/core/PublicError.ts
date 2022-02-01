
import { CustomError } from 'ts-custom-error'

export default class PublicError extends CustomError {
    expose = true
    message = ''
    statusCode: number
    constructor(message, statusCode = 500) {
      super()
      this.message = message
      this.statusCode = statusCode
    }
}
