import { Request, Response } from 'express'
import CustomError from '../utlis/customError'

export default abstract class Base {
  entity: string
  contentType: object

  constructor(entity: string, contentType: object) {
    this.entity = entity
    this.contentType = contentType
  }

  abstract reqToOperation(req: Request): string

  exec = async (req: Request, res: Response) => {
    try {
      const operation = this.reqToOperation(req)
      if (operation) {
        return await this[operation](req, res)
      } else {
        throw new CustomError(400, '未サポートのオペレーションです')
      }
    } catch (err) {
      const code = err instanceof CustomError ? err.code : err.$metadata.httpStatusCode
      const message = err.message
      res.status(code).set(this.contentType).send({ message })

      throw err
    }
  }
}
