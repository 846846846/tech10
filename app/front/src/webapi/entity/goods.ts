import ClientLib, { Request } from '../libs/axios'

const ENDPOINT = '/private/goods/'

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
          Authorization: this.getAuthorization(),
        },
      }
      return super.post(req)
    } catch (err) {
      throw err
    }
  }

  public async readList() {
    try {
      const req: Request = {
        url: ENDPOINT,
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.getAuthorization(),
        },
      }
      return super.get(req)
    } catch (err) {
      throw err
    }
  }

  public async readDetail(Id: string) {
    try {
      console.log(Id)
      const req: Request = {
        url: ENDPOINT + Id,
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.getAuthorization(),
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
          Authorization: this.getAuthorization(),
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
          Authorization: this.getAuthorization(),
        },
      }
      return super.delete(req)
    } catch (err) {
      throw err
    }
  }
}
