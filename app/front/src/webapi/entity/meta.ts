import ClientLib, { Request } from '../libs/axios'

export class MetaAPI extends ClientLib {
  constructor() {
    super()
  }

  public async health() {
    try {
      const req: Request = {
        url: '/health',
      }
      return super.get(req)
    } catch (err) {
      throw err
    }
  }

  public async generatePresignedUrl(params: any, upload: boolean) {
    try {
      const req: Request = {
        url: upload ? '/presigned-url/upload' : '/presigned-url/download',
        params,
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
      return super.put(req, false)
    } catch (err) {
      throw err
    }
  }
}
