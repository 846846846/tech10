import ClientLib, { Request } from '../libs/axios'

// const ENDPOINT = '/api/v1/goods/'

export type APIType = 'create' | 'read' | 'update' | 'delete'

export class MetaAPI extends ClientLib {
  constructor() {
    super()
  }

  public async health() {
    try {
      const req: Request = {
        url: '/api/v1/health',
      }
      return super.get(req)
    } catch (err) {
      throw err
    }
  }

  public async generatePresignedUrl() {
    try {
      const req: Request = {
        url: '/api/v1/generate-presigned-url',
        headers: {
          Authorization: 'dummy', // (TBD:チケットNoのECSITE-14で対応) 認証情報。
        },
      }
      return super.get(req)
    } catch (err) {
      throw err
    }
  }

  public async uploadPresignedUrl(url: any, params: any) {
    try {
      const req: Request = {
        url,
        params,
        headers: {
          'Content-Type': params.type,
          // Authorization: 'dummy', // PreSignedURLを利用する場合は付加してはいけない.
        },
      }
      console.log(req)
      return super.put(req, false)
    } catch (err) {
      throw err
    }
  }
}
