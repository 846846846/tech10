import serverlessExpress from '@vendia/serverless-express'
import express from 'express'
import { Request, Response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import * as sourceMapSupport from 'source-map-support'
import Meta from '../entity/meta'
import Products from '../entity/products'
import Orders from '../entity/orders'

sourceMapSupport.install()

export const app = express()
const router = express.Router()

// [middleware] body parser.
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

// [middleware] cors.
router.use(cors())

const domain = '/api/v1/private'

// [entity] AWS S3 PresignedUrl.
router.get(domain + '/presigned-url', async (req: Request, res: Response, _next) => {
  try {
    await new Meta().presignedUrl(req, res)
  } catch (err) {
    console.error(err)
  }
})

// [entity] 商品情報.
router.use(domain + '/products', async (req: Request, res: Response) => {
  try {
    await new Products().exec(req, res)
  } catch (err) {
    console.error(err)
  }
})

// [entity] 注文情報.
router.use(domain + '/orders', async (req: Request, res: Response) => {
  try {
    await new Orders().exec(req, res)
  } catch (err) {
    console.error(err)
  }
})

// [middleware] 要求されたAPIは未実装
router.use((req: Request, res: Response, _next) => {
  console.error('unsuppoted url: ', req.url)
  return res.status(404).json({ message: '未サポートのAPIです' })
})

app.use('/', router)
export const handler = serverlessExpress({ app })
