import serverlessExpress from '@vendia/serverless-express'
import express from 'express'
import { Request, Response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import * as sourceMapSupport from 'source-map-support'
import Meta from '../entity/meta'
import Users from '../entity/users'

sourceMapSupport.install()

export const app = express()
const router = express.Router()

// [middleware] body parser.
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

// [middleware] cors.
router.use(cors())

const domain = '/api/v1/public'

// [entity] health.
router.get(domain + '/health', async (req, res, _next) => {
  await new Meta().health(req, res)
})

// [entity] ユーザー情報.
router.post(domain + '/users/*', async (req, res) => {
  try {
    await new Users().exec(req, res)
  } catch (err) {
    console.error(err)
  }
})

// [middleware] 要求されたAPIは未実装
router.use((req: Request, res: Response, _next) => {
  console.error('未サポートのAPIです: ', req.url)
  return res.status(404).json({ message: '未サポートのAPIです' })
})

app.use('/', router)
export const handler = serverlessExpress({ app })
