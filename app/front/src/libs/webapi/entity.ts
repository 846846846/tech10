import ClientLib, { Request } from './axios'

export default class EntityAPI extends ClientLib {
  entity: string

  constructor(entity: string) {
    super()
    this.entity = entity
  }

  public async create(params: any) {
    try {
      const req: Request = {
        url: '/private/' + this.entity,
        params: params,
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.getAuthorization(),
        },
      }
      console.log(req)
      return super.post(req)
    } catch (err) {
      throw err
    }
  }

  public async readList() {
    try {
      const req: Request = {
        url: '/private/' + this.entity,
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
        url: '/private/' + this.entity + '/' + Id,
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
        url: '/private/' + this.entity + '/' + params.id,
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
        url: '/private/' + this.entity + '/' + params.id,
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
