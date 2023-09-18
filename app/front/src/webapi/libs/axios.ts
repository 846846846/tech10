import axios, { AxiosRequestConfig } from 'axios'

export type Request = Pick<AxiosRequestConfig, 'url' | 'params' | 'headers'>

export default class ClientLib {
  private host: string

  constructor() {
    console.log(process.env.NEXT_PUBLIC_API_HOST)
    this.host =
      process.env.NEXT_PUBLIC_API_HOST === undefined
        ? 'http://localhost:3001/dev'
        : process.env.NEXT_PUBLIC_API_HOST
  }

  public async get(req: Request) {
    try {
      const { url, params, headers } = { ...req }
      const res = await axios.get(this.host + url, {
        headers,
      })
      return res
    } catch (err) {
      throw err
    }
  }

  public async post(req: Request, autoAddHost: boolean = true) {
    try {
      const { url, params, headers } = { ...req }
      const res = await axios.post(
        autoAddHost || url == undefined ? this.host + url : url,
        params,
        { headers }
      )
      return res
    } catch (err) {
      throw err
    }
  }

  public async put(req: Request, autoAddHost: boolean = true) {
    try {
      const { url, params, headers } = { ...req }
      const res = await axios.put(
        autoAddHost || url == undefined ? this.host + url : url,
        params,
        {
          headers,
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
      const res = await axios.delete(this.host + url, { headers })
      return res
    } catch (err) {
      throw err
    }
  }
}
