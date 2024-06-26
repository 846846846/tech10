import ClientLib, { Request } from './axios'

const ENDPOINT = '/public/users/'

export default class UsersAPI extends ClientLib {
  constructor() {
    super()
  }

  public async signup(params: any) {
    try {
      const req: Request = {
        url: ENDPOINT + 'signup',
        params: params,
        headers: {
          'Content-Type': 'application/json',
        },
      }
      return super.post(req)
    } catch (err) {
      throw err
    }
  }

  public async confirmSignup(params: any) {
    try {
      const req: Request = {
        url: ENDPOINT + 'confirmSignup',
        params: params,
        headers: {
          'Content-Type': 'application/json',
        },
      }
      return super.post(req)
    } catch (err) {
      throw err
    }
  }

  public async signin(params: any) {
    try {
      const req: Request = {
        url: ENDPOINT + 'signin',
        params: params,
        headers: {
          'Content-Type': 'application/json',
        },
      }
      return super.post(req)
    } catch (err) {
      throw err
    }
  }
}
