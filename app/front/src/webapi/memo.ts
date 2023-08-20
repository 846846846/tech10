import SuperClass, { Request } from './clientLib/axios'

const ENDPOINT = '/api/v1/memos/'

export type APIType = 'create' | 'read' | 'update' | 'delete'

export class MemoClass extends SuperClass {
  constructor() {
    super()
  }

  public async create(params: any) {
    try {
      const req: Request = {
        url: ENDPOINT,
        params: params,
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
      }
      return super.delete(req)
    } catch (err) {
      throw err
    }
  }
}
