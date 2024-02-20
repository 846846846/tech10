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
  abstract create(req: Request): Promise<string>
  abstract read(req: Request): Promise<string>
  abstract update(req: Request): Promise<string>
  abstract delete(req: Request): Promise<string>

  // リクエストを元に実行関数を選び実行する.
  async exec(req: Request): Promise<string | undefined> {
    try {
      switch (req.method) {
        case 'POST':
          return await this.create(req)
        case 'GET':
          return await this.read(req)
        case 'PUT':
          return await this.update(req)
        case 'DELETE':
          return await this.delete(req)
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
