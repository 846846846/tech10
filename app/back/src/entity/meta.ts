import { Request, query } from 'express'
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import moment from 'moment'
import UserInfoLib from '../libs/userInfo'

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

export const generatePresignedUrl = async (req: Request, upload: boolean) => {
  const userInfoLib = new UserInfoLib()
  const owner = userInfoLib.getOwner(req.headers['authorization'])
  const name = req.query.name as string

  const Bucket = process.env.IS_OFFLINE ? 'images' : process.env.IMAGE_S3_BUCKET

  const dir = owner + '/'
  const jstTime = moment().tz('Asia/Tokyo').format('YYYYMMDDTHHmmssSSS')
  const Key = upload ? dir + jstTime + '_' + name : name

  const expiresIn = 600 // 有効期限(秒).

  try {
    const command = upload
      ? new PutObjectCommand({
          Bucket,
          Key,
          ContentType: req.query.type as string,
        })
      : new GetObjectCommand({ Bucket, Key })
    const url = await getSignedUrl(s3Client, command, {
      expiresIn,
    })
    const result = JSON.stringify({ url })
    return result
  } catch (err) {
    throw err
  }
}
