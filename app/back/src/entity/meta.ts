import { Request, Response } from 'express'
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { getCurrentTime } from '../utlis'
import Base from './base'
import JWTWrap from '../utlis/jwt'

export default class Meta extends Base {
  s3Client = process.env.IS_OFFLINE
    ? new S3Client({
        region: process.env.REGION,
        forcePathStyle: true,
        endpoint: 'http://s3.localhost.localstack.cloud:4566',
        credentials: {
          accessKeyId: 'dummy',
          secretAccessKey: 'dummy',
        },
      })
    : new S3Client({
        region: process.env.REGION,
        forcePathStyle: true,
      })

  constructor() {
    super('meta', { 'content-type': 'applicaion/json' })
  }

  reqToOperation(req: Request) {
    const operationMap = {
      health: 'health',
      presignedUrl: 'presignedUrl',
    }
    const operation = req.path.replace(/^\//, '')
    return operationMap[operation] || undefined
  }

  // @ts-ignore
  private health = async (_req: Request, res: Response) => {
    res.status(200).set(this.contentType).send({ message: 'Hello World!!' })
  }

  // @ts-ignore
  private presignedUrl = async (req: Request, res: Response) => {
    const owner = new JWTWrap(req.headers['authorization']).getOwner()
    const name = req.query.name as string
    const type = req.query.type as string
    const upload = req.query.upload === undefined ? false : req.query.upload

    const Bucket = process.env.IS_OFFLINE ? 'images' : process.env.IMAGE_S3_BUCKET
    const Key = upload ? owner + '/' + getCurrentTime() + '_' + name : name
    const expiresIn = 60 // 有効期限(秒).

    try {
      const command = upload
        ? new PutObjectCommand({
            Bucket,
            Key,
            ContentType: type,
          })
        : new GetObjectCommand({ Bucket, Key })
      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn,
      })
      console.log(url)
      res.status(200).set(this.contentType).send({ url })
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}
