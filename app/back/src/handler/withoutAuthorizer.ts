import serverlessExpress from '@vendia/serverless-express'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import * as sourceMapSupport from 'source-map-support'
import Meta from '../entity/meta'
import * as users from '../entity/users'

sourceMapSupport.install()

const app = express()
const router = express.Router()

// [middleware] body parser.
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

// [middleware] cors.
router.use(cors())

const domain = '/api/v1/public'

// meta.
router.get(domain + '/health', async (req, res, _next) => {
  try {
    await new Meta().health(req, res)
  } catch (err) {
    console.error(err)
  }
})

// users.
router.post(domain + '/users/signup', async (_req, res, _next) => {
  try {
    const result = await users.signup(_req)
    const { statusCode, body } = { ...result }
    res.set('content-type', 'applicaion/json')
    res.status(statusCode).send(body)
  } catch (err) {
    const error = new Error(err.message)
    _next(error)
  }
})

router.post(domain + '/users/confirmSignUp', async (_req, res, _next) => {
  try {
    const result = await users.confirmSignUp(_req)
    const { statusCode, body } = { ...result }
    res.set('content-type', 'applicaion/json')
    res.status(statusCode).send(body)
  } catch (err) {
    const error = new Error(err.message)
    _next(error)
  }
})

router.post(domain + '/users/signin', async (_req, res, _next) => {
  try {
    const result = await users.signin(_req)
    const { statusCode, body } = { ...result }
    res.set('content-type', 'applicaion/json')
    res.status(statusCode).send(body)
  } catch (err) {
    const error = new Error(err.message)
    _next(error)
  }
})

// [middleware] unexpected.
router.use((_req, res, _next) => {
  console.error(_req)
  return res.status(404).json({
    error: 'Not Found API',
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
