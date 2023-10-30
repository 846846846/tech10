import serverlessExpress from '@vendia/serverless-express'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import * as sourceMapSupport from 'source-map-support'
import * as meta from './entity/meta'
import * as users from './entity/users'
import * as goods from './entity/goods'

sourceMapSupport.install()

const app = express()
const router = express.Router()

// [middleware] body parser.
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

// [middleware] cors.
router.use(cors())

// meta.
router.get('/api/v1/health', async (_req, res, _next) => {
  try {
    const result = await meta.health(_req)
    res.set('content-type', 'applicaion/json')
    res.send(result)
  } catch (err) {
    const error = new Error(err.message)
    _next(error)
  }
})

router.get('/api/v1/presigned-url/upload', async (_req, res, _next) => {
  try {
    const result = await meta.generatePresignedUrl(_req, true)
    res.set('content-type', 'applicaion/json')
    res.send(result)
  } catch (err) {
    const error = new Error(err.message)
    _next(error)
  }
})

router.get('/api/v1/presigned-url/download', async (_req, res, _next) => {
  try {
    const result = await meta.generatePresignedUrl(_req, false)
    res.set('content-type', 'applicaion/json')
    res.send(result)
  } catch (err) {
    const error = new Error(err.message)
    _next(error)
  }
})

// users.
router.post('/api/v1/users/signup', async (_req, res, _next) => {
  try {
    const result = await users.signup(_req)
    res.set('content-type', 'applicaion/json')
    res.send(result)
  } catch (err) {
    const error = new Error(err.message)
    _next(error)
  }
})

router.post('/api/v1/users/confirmSignUp', async (_req, res, _next) => {
  try {
    const result = await users.confirmSignUp(_req)
    res.set('content-type', 'applicaion/json')
    res.send(result)
  } catch (err) {
    const error = new Error(err.message)
    _next(error)
  }
})

router.post('/api/v1/users/signin', async (_req, res, _next) => {
  try {
    const result = await users.signin(_req)
    res.set('content-type', 'applicaion/json')
    res.send(result)
  } catch (err) {
    const error = new Error(err.message)
    _next(error)
  }
})

// goods.
router.get('/api/v1/goods', async (_req, res, _next) => {
  try {
    const result = await goods.readAll(_req)
    res.set('content-type', 'applicaion/json')
    res.send(result)
  } catch (err) {
    const error = new Error(err.message)
    _next(error)
  }
})

router.get('/api/v1/goods/:id', async (_req, res, _next) => {
  const id = _req.params.id
  try {
    const result = await goods.readByID(_req, id)
    res.set('content-type', 'applicaion/json')
    res.send(result)
  } catch (err) {
    const error = new Error(err.message)
    _next(error)
  }
})

router.post('/api/v1/goods', async (_req, res, _next) => {
  try {
    const result = await goods.create(_req)
    res.set('content-type', 'applicaion/json')
    res.send(result)
  } catch (err) {
    const error = new Error(err.message)
    _next(error)
  }
})

router.put('/api/v1/goods/:id', async (_req, res, _next) => {
  const id = _req.params.id
  try {
    const result = await goods.update(_req, id)
    res.set('content-type', 'applicaion/json')
    res.send(result)
  } catch (err) {
    const error = new Error(err.message)
    _next(error)
  }
})

router.delete('/api/v1/goods/:id', async (_req, res, _next) => {
  const id = _req.params.id
  try {
    const result = await goods.deleteCus(_req, id)
    res.set('content-type', 'applicaion/json')
    res.send(result)
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
