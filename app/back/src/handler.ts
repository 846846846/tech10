import serverlessExpress from '@vendia/serverless-express'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import * as sourceMapSupport from 'source-map-support'
import * as memos from './functions/memos'

sourceMapSupport.install()

const app = express()
const router = express.Router()

// [middleware] body parser.
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

// [middleware] cors.
router.use(cors())

// health check.
router.get('/health', (_req, res, _next) => {
  return res.status(200).json({
    message: 'Hello World!!',
  })
})

// memos.
router.get('/api/v1/memos', async (_req, res, _next) => {
  try {
    const result = await memos.readAll(_req)
    res.set('content-type', 'applicaion/json')
    res.send(result)
  } catch (err) {
    const error = new Error(err.message)
    _next(error)
  }
})

router.get('/api/v1/memos/:id', async (_req, res, _next) => {
  const id = _req.params.id
  try {
    const result = await memos.readByID(_req, id)
    res.set('content-type', 'applicaion/json')
    res.send(result)
  } catch (err) {
    const error = new Error(err.message)
    _next(error)
  }
})

router.post('/api/v1/memos', async (_req, res, _next) => {
  try {
    const result = await memos.create(_req)
    res.set('content-type', 'applicaion/json')
    res.send(result)
  } catch (err) {
    const error = new Error(err.message)
    _next(error)
  }
})

router.put('/api/v1/memos/:id', async (_req, res, _next) => {
  const id = _req.params.id
  try {
    const result = await memos.update(_req, id)
    res.set('content-type', 'applicaion/json')
    res.send(result)
  } catch (err) {
    const error = new Error(err.message)
    _next(error)
  }
})

router.delete('/api/v1/memos/:id', async (_req, res, _next) => {
  const id = _req.params.id
  try {
    const result = await memos.deleteMemo(_req, id)
    res.set('content-type', 'applicaion/json')
    res.send(result)
  } catch (err) {
    const error = new Error(err.message)
    _next(error)
  }
})

// [middleware] unexpected.
router.use((_req, res, _next) => {
  return res.status(404).json({
    error: 'Not Found API',
  })
})

// [middleware] error handling.
router.use((err, req, res, next) => {
  console.error(err.message)
  const status = err.message.split(':')[0]
  console.log(status)
  const message = err.message.split(':')[1]
  console.log(message)
  res.status(status).json({ message: message })

  // res.status(500).json({ error: err.message })
})

app.use('/', router)
export const handler = serverlessExpress({ app })
