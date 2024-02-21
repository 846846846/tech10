import ClientLib, { Request } from '../libs/axios'

export class ProductsAPI extends ClientLib {
  endPoint = '/private/products/'

  constructor() {
    super()
  }

  public async create(params: any) {
    try {
      const req: Request = {
        url: this.endPoint,
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
        url: this.endPoint,
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
        url: this.endPoint + Id,
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
        url: this.endPoint + params.id,
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
        url: this.endPoint + params.id,
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
