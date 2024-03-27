import { Request, Response } from 'express'
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import moment from 'moment'
import JWTWrap from '../utlis/jwt'
import CustomError from '../utlis/customError'

export default class Meta {
  contentType = { 'content-type': 'applicaion/json' }

  s3Client = process.env.IS_OFFLINE
    ? new S3Client({
        region: 'ap-northeast-1',
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

  health = async (_req: Request, res: Response) => {
    res.status(200).set(this.contentType).send({ message: 'Hello World!!' })
  }

  presignedUrl = async (req: Request, res: Response) => {
    const owner = new JWTWrap(req.headers['authorization']).getOwner()
    const name = req.query.name as string
    const type = req.query.type as string
    const upload = req.query.upload === undefined ? false : req.query.upload

    const Bucket = process.env.IS_OFFLINE ? 'images' : process.env.IMAGE_S3_BUCKET

    const dir = owner + '/'
    const jstTime = moment().tz('Asia/Tokyo').format('YYYYMMDDTHHmmssSSS')
    const Key = upload ? dir + jstTime + '_' + name : name

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
      const code = err instanceof CustomError ? err.code : 500
      res.status(code).set(this.contentType).send({ message: err.message })

      throw err
    }
  }
}
