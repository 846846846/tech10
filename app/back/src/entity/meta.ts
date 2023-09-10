import { Request } from 'express'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import crypto from 'crypto'

const s3Client = new S3Client({
  region: 'ap-northeast-1',
  forcePathStyle: true,
  endpoint: 'http://s3.localhost.localstack.cloud:4566',
  credentials: {
    accessKeyId: 'dummy',
    secretAccessKey: 'dummy',
  },
})

export const health = async (req: Request) => {
  return { message: 'Hello World!!' }
}

export const generatePresignedUrl = async (req: Request) => {
  const owner = req.headers.authorization // (TBD:チケットNoのECSITE-14で対応) 認証情報からオーナー名を逆引き。
  console.log(owner)

  const Bucket = 'goods'

  const dir = owner + '/'
  const uuid: string = crypto.randomUUID()
  const extension = '.jpeg'
  const Key = dir + uuid + extension

  const ContentType = 'image/jpeg'
  const expiresIn = 900

  try {
    const command = new PutObjectCommand({
      Bucket,
      Key,
      ContentType,
    })
    const url = await getSignedUrl(s3Client, command, {
      expiresIn,
    })
    console.log(url)
    const result = JSON.stringify({ url })
    return result
  } catch (err) {
    throw err
  }
}
