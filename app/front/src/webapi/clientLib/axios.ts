import axios, { AxiosRequestConfig } from 'axios'

export type Request = Pick<AxiosRequestConfig, 'url' | 'baseURL' | 'params'>

export default class AxiosWrapClass {
  private host: string

  constructor() {
    console.log(process.env.NEXT_PUBLIC_API_HOST)
    this.host =
      process.env.NEXT_PUBLIC_API_HOST === undefined
        ? 'http://localhost:3001/dev'
        : process.env.NEXT_PUBLIC_API_HOST
  }

  public async health() {
    try {
      const res = await axios.get(this.host + '/health')
      return res
    } catch (err) {
      throw err
    }
  }

  public async get(req: Request) {
    try {
      const res = await axios.get(this.host + req.url, {
        headers: { 'Content-Type': 'application/json' },
      })
      return res
    } catch (err) {
      throw err
    }
  }

  public async post(req: Request) {
    try {
      const res = await axios.post(this.host + req.url, req.params)
      return res
    } catch (err) {
      throw err
    }
  }

  public async put(req: Request) {
    try {
      const res = await axios.put(this.host + req.url, req.params)
      return res
    } catch (err) {
      throw err
    }
  }

  public async delete(req: Request) {
    try {
      const res = await axios.delete(this.host + req.url)
      return res
    } catch (err) {
      throw err
    }
  }
}
