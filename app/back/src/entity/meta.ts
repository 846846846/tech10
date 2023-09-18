import { Request } from 'express'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import crypto from 'crypto'
import * as __LOG from '../libs/log'

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
  const Bucket = process.env.IS_OFFLINE ? 'goods' : process.env.IMAGE_S3_BUCKET
  __LOG.display(Bucket)

  const dir = owner + '/'
  const uuid: string = crypto.randomUUID()
  const extension = '.jpeg'
  const Key = dir + uuid + extension

  const ContentType = 'image/jpeg'
  const expiresIn = 900

  try {
    __LOG.display(1)
    const command = new PutObjectCommand({
      Bucket,
      Key,
      ContentType,
    })
    __LOG.display(command)
    const url = await getSignedUrl(s3Client, command, {
      expiresIn,
    })
    __LOG.display(url)
    const result = JSON.stringify({ url })
    __LOG.display(result)
    return result
  } catch (err) {
    throw err
  }
}
