import ClientLib, { Request } from '../libs/axios'

export class MetaAPI extends ClientLib {
  constructor() {
    super()
  }

  public async health() {
    try {
      const req: Request = {
        url: '/public/health',
      }
      return super.get(req)
    } catch (err) {
      throw err
    }
  }

  public async generatePresignedUrl(params: any, upload: boolean) {
    try {
      const req: Request = {
        url: upload
          ? '/private/presigned-url/upload'
          : '/private/presigned-url/download',
        params,
        headers: {
          Authorization: this.getAuthorization(),
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
          // Authorization: this.getAuthorization(),  // PreSignedURLを利用する場合は付加してはいけない.
        },
      }
      return super.put(req, false)
    } catch (err) {
      throw err
    }
  }
}
