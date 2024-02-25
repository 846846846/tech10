import serverlessExpress from '@vendia/serverless-express'
import express from 'express'
import { Request, Response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import * as sourceMapSupport from 'source-map-support'
import * as meta from '../entity/meta'
import Products from '../entity/products'
import Orders from '../entity/orders'

sourceMapSupport.install()

const app = express()
const router = express.Router()

// [middleware] body parser.
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

// [middleware] cors.
router.use(cors())

const domain = '/api/v1/private'

// meta.
router.get(domain + '/presigned-url/upload', async (_req, res, _next) => {
  try {
    const result = await meta.generatePresignedUrl(_req, true)
    res.set('content-type', 'applicaion/json')
    res.send(result)
  } catch (err) {
    const error = new Error(err.message)
    _next(error)
  }
})

router.get(domain + '/presigned-url/download', async (_req, res, _next) => {
  try {
    const result = await meta.generatePresignedUrl(_req, false)
    res.set('content-type', 'applicaion/json')
    res.send(result)
  } catch (err) {
    const error = new Error(err.message)
    _next(error)
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
router.use((_req, res, _next) => {
  console.error(_req)
  return res.status(404).json({
    error: '指定されたエンドポイントは見つかりません',
  })
})

// [middleware] error handling.
router.use((err, req, res, next) => {
  console.error(err.message)
  const status = err.message.split(':')[0]
  console.error(status)
  const message = err.message.split(':')[1]
  console.error(message)
  res.status(status).json({ message: message })

  // res.status(500).json({ error: err.message })
})

app.use('/', router)
export const handler = serverlessExpress({ app })
