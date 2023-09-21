import { Request, query } from 'express'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import moment from 'moment'

// const s3Client = new S3Client({
//   region: 'ap-northeast-1',
//   forcePathStyle: true,
//   endpoint: 'http://s3.localhost.localstack.cloud:4566',
//   credentials: {
//     accessKeyId: 'dummy',
//     secretAccessKey: 'dummy',
//   },
// })

const s3Client = process.env.IS_OFFLINE
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
      // credentials: {
      //   accessKeyId: '',
      //   secretAccessKey: '',
      // },
    })

export const health = async (req: Request) => {
  return { message: 'Hello World!!' }
}

export const generatePresignedUrl = async (req: Request) => {
  const owner = req.headers.authorization // (TBD:チケットNoのECSITE-14で対応) 認証情報からオーナー名を逆引き。
  const name = req.query.name as string
  const type = req.query.type as string

  const Bucket = process.env.IS_OFFLINE ? 'images' : process.env.IMAGE_S3_BUCKET

  const dir = owner + '/'
  const jstTime = moment().tz('Asia/Tokyo').format('YYYYMMDDTHHmmssSSS')
  const Key = dir + jstTime + '_' + name

  const ContentType = type
  const expiresIn = 29 // 有効期限(秒)。API Gatewayのタイムアウト上限とする.

  try {
    const command = new PutObjectCommand({
      Bucket,
      Key,
      ContentType,
    })
    const url = await getSignedUrl(s3Client, command, {
      expiresIn,
    })
    const result = JSON.stringify({ url })
    return result
  } catch (err) {
    throw err
  }
}