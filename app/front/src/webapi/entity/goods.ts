import ClientLib, { Request } from '../libs/axios'

const ENDPOINT = '/goods/'

export type APIType = 'create' | 'read' | 'update' | 'delete'

export class GoodsAPI extends ClientLib {
  constructor() {
    super()
  }

  public async create(params: any) {
    try {
      const req: Request = {
        url: ENDPOINT,
        params: params,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'dummy', // (TBD:チケットNoのECSITE-14で対応) 認証情報。
        },
      }
      return super.post(req)
    } catch (err) {
      throw err
    }
  }

  public async read() {
    try {
      const req: Request = {
        url: ENDPOINT,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'dummy', // (TBD:チケットNoのECSITE-14で対応) 認証情報。
        },
      }
      return super.get(req)
    } catch (err) {
      throw err
    }
  }

  public async update(params: any) {
    try {
      const req: Request = {
        url: ENDPOINT + params.id,
        params: params,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'dummy', // (TBD:チケットNoのECSITE-14で対応) 認証情報。
        },
      }
      return super.put(req)
    } catch (err) {
      throw err
    }
  }

  public async delete(params: any) {
    try {
      const req: Request = {
        url: ENDPOINT + params.id,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'dummy', // (TBD:チケットNoのECSITE-14で対応) 認証情報。
        },
      }
      return super.delete(req)
    } catch (err) {
      throw err
    }
  }
}
