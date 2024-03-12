import { Request, Response } from 'express'
import crypto from 'crypto'
import moment from 'moment'
import 'moment-timezone'

export default abstract class Base {
  entity: string
  table: string
  gsi1: string

  constructor(entity: string, table: string, gsi1: string) {
    this.entity = entity
    this.table = table
    this.gsi1 = gsi1
  }

  // 実行関数の抽象定義群.
  abstract create(req: Request, res: Response): Promise<void>
  abstract read(req: Request, res: Response): Promise<void>
  abstract update(req: Request, res: Response): Promise<void>
  abstract delete(req: Request, res: Response): Promise<void>

  // リクエストを元に実行関数を選び実行する.
  async exec(req: Request, res: Response): Promise<void> {
    try {
      switch (req.method) {
        case 'POST':
          console.log('exec create...')
          return await this.create(req, res)
        case 'GET':
          console.log('exec read...')
          return await this.read(req, res)
        case 'PUT':
          console.log('exec put...')
          return await this.update(req, res)
        case 'DELETE':
          console.log('exec delete...')
          return await this.delete(req, res)
        default:
          throw new Error('400:Unsupported methods.')
      }
    } catch (err) {
      throw err
    }
  }

  // uuid生成.
  generateUUID(): string {
    return crypto.randomUUID()
  }

  // 現在時刻取得.
  getCurrentTime(): string {
    return moment().tz('Asia/Tokyo').format('YYYY-MM-DDTHH:mm:ssZ')
  }

  // プレフィックス付加
  addPrefix(input: string, prefix: string): string {
    return `${prefix}${input}`
  }

  // プレフィックス削除
  removePrefix(input: string, prefix: string): string {
    return input.replace(prefix, '')
  }
}
