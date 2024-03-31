import request from 'supertest'
import { mockClient } from 'aws-sdk-client-mock'
import { DynamoDBDocumentClient, TransactWriteCommand } from '@aws-sdk/lib-dynamodb'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { app } from '../../src/handler/withAuthorizer'

// AWS SDKをモック化
jest.mock('@aws-sdk/client-s3')
jest.mock('@aws-sdk/s3-request-presigner')

// DynamoDBDocumentClientのモックを作成
const ddbDocumentClientMock = mockClient(DynamoDBDocumentClient)

// 型キャスティングでjest.Mockを使用
const mockedGetSignedUrl = getSignedUrl as jest.MockedFunction<typeof getSignedUrl>

const CustomerBearer =
  'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImR1bW15IiwidHlwIjoiSldUIn0.eyJpc3MiOiJodHRwczovL2NvZ25pdG8taWRwLmFwLW5vcnRoZWFzdC0xLmFtYXpvbmF3cy5jb20vYXAtbm9ydGhlYXN0LTFfYmEzOWJlYzM3NTYzNDE2ZWE5NDI3ZDc3MzdlZjk1N2UiLCJzdWIiOiJiZjE5NWRhYi0wYmMyLTQyMTAtOTY5OC03ZjE5ZjczZThiODUiLCJhdWQiOiJ0eXFrb2QydDUxMnhjZDIydjYycWIyZWNjYiIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzExNDg1NDczLCJleHAiOjE3MTE0ODkwNzMsImNvZ25pdG86dXNlcm5hbWUiOiJDdXN0b21lcjEifQ.jXmMCCoU3n-FXx6CnEjT8JtHUjPvfjQRzqUvGOH56dyT7dtFoRoxvlrLIYDN2n27tGTYxGrCPf2F-q18iPds4_8Mg5GJ6cwBQnZrzShOE1oBmDTLIuAo3nCnwhF7pBA1VufUaVs6SGLtTB57vAQr4o8qeEDeeRETmFh3i146T-alQQnkKD8RQaYcp0Cwkn_k9RLEPYDrgXLzLbqo9t4ltfB9uoa1LFI7-CmrITlveapkLCdTHQazigfe9fMjGDbwJhm-PdSjgncPsWVLplw3rxwRroP9rc3VgqAVutSDf4Nm4QciwFiyd9wzdzLdFEklL1s4a7pzJ_0vSI7r5tKi_Q'

describe('withAuthorizer handler tests', () => {
  beforeEach(() => {
    mockedGetSignedUrl.mockReset()
    ddbDocumentClientMock.reset()
  })

  it('presigned-url should return 200', async () => {
    const url = 'mocked-upload-url'
    mockedGetSignedUrl.mockResolvedValue(url)

    await request(app)
      .get('/api/v1/private/presigned-url')
      .query({ name: 'value1', type: 'value2' })
      .set('authorization', CustomerBearer)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect({ url })
  })

  it('presigned-url should return 500 if fails', async () => {
    const message = 'getSignedUrl error'
    mockedGetSignedUrl.mockRejectedValue(new Error(message))

    await request(app)
      .get('/api/v1/private/presigned-url')
      .query({ name: 'value1', type: 'value2' })
      .set('authorization', CustomerBearer)
      .expect(500)
      .expect('Content-Type', /json/)
      .expect({ message })
  })

  it('products should return 200', async () => {
    const reqBody = { name: 'Test Product', price: 100 }
    ddbDocumentClientMock.on(TransactWriteCommand).resolves({})

    await request(app).post('/api/v1/private/products').set('authorization', CustomerBearer).send(reqBody).expect('content-type', /json/).expect(201)
  })

  it('products should return 500 if fails', async () => {
    const message = 'DynamoDB operation failed'
    const reqBody = { name: 'Test Product', price: 100 }
    ddbDocumentClientMock.on(TransactWriteCommand).rejects(new Error(message))

    await request(app)
      .post('/api/v1/private/products')
      .set('authorization', CustomerBearer)
      .send(reqBody)
      .expect('content-type', /json/)
      .expect(500)
      .expect({ message })
  })

  it('orders should return 201', async () => {
    const reqBody = [
      {
        productId: 'ac79f107-4db1-4a88-bd7d-306537fa8b22',
        price: 100,
        quantity: 5,
      },
      {
        productId: 'rc19f107-as-4a88-bd73-306b37fa8b22',
        price: 200,
        quantity: 15,
      },
    ]
    ddbDocumentClientMock.on(TransactWriteCommand).resolves({})

    await request(app).post('/api/v1/private/orders').set('authorization', CustomerBearer).send(reqBody).expect('content-type', /json/).expect(201)
  })

  it('orders should return 500 if fails', async () => {
    const message = 'DynamoDB operation failed'
    const reqBody = [
      {
        productId: 'ac79f107-4db1-4a88-bd7d-306537fa8b22',
        price: 100,
        quantity: 5,
      },
      {
        productId: 'rc19f107-as-4a88-bd73-306b37fa8b22',
        price: 200,
        quantity: 15,
      },
    ]
    ddbDocumentClientMock.on(TransactWriteCommand).rejects(new Error(message))

    await request(app)
      .post('/api/v1/private/orders')
      .set('authorization', CustomerBearer)
      .send(reqBody)
      .expect('content-type', /json/)
      .expect(500)
      .expect({ message })
  })

  it('unsuppted API handle error', async () => {
    await request(app)
      .post('/api/v1/private/unsuppted')
      .set('authorization', CustomerBearer)
      .send({})
      .expect('content-type', /json/)
      .expect(404)
      .expect({ message: '未サポートのAPIです' })
  })
})
