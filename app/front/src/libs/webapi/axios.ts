import axios, { AxiosRequestConfig } from 'axios'
import LocalStorageLib from '../../libs/storage/localStorage'

export type Request = Pick<AxiosRequestConfig, 'url' | 'params' | 'headers'>

export default class ClientLib {
  private host: string

  constructor() {
    this.host =
      process.env.NEXT_PUBLIC_API_HOST === undefined
        ? 'http://localhost:3001/local/api/v1'
        : process.env.NEXT_PUBLIC_API_HOST
  }

  protected getAuthorization() {
    let rtn = 'Bearer '
    const jwtToken = new LocalStorageLib().getJwtToken()
    if (jwtToken) {
      rtn += jwtToken.IdToken
    }
    return rtn
  }

  public getReqDest() {
    return process.env.NEXT_PUBLIC_API_HOST?.includes('localhost')
      ? 'localhost'
      : 'remote'
  }

  public async post(req: Request, autoAddHost: boolean = true) {
    try {
      const { url, params, headers } = { ...req }
      const updatedHeaders = {
        ...headers,
        'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
      }
      const res = await axios.post(
        autoAddHost || url == undefined ? this.host + url : url,
        params,
        { headers: updatedHeaders }
      )
      return res
    } catch (err) {
      throw err
    }
  }

  public async get(req: Request, autoAddHost: boolean = true) {
    try {
      const { url, params, headers } = { ...req }
      const updatedHeaders = {
        ...headers,
        'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
      }
      const res = await axios.get(
        autoAddHost || url == undefined ? this.host + url : url,
        {
          params,
          headers: updatedHeaders,
        }
      )
      return res
    } catch (err) {
      throw err
    }
  }

  public async put(req: Request, autoAddHost: boolean = true) {
    try {
      const { url, params, headers } = { ...req }
      const updatedHeaders = {
        ...headers,
        'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
      }
      const res = await axios.put(
        autoAddHost || url == undefined ? this.host + url : url,
        params,
        {
          headers: updatedHeaders,
        }
      )
      return res
    } catch (err) {
      throw err
    }
  }

  public async delete(req: Request) {
    try {
      const { url, params, headers } = { ...req }
      const updatedHeaders = {
        ...headers,
        'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
      }
      const res = await axios.delete(this.host + url, {
        headers: updatedHeaders,
      })
      return res
    } catch (err) {
      throw err
    }
  }
}
