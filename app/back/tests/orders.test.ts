import request from 'supertest'
import { mockClient } from 'aws-sdk-client-mock'
import { DynamoDBDocumentClient, TransactWriteCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import crypto from 'crypto'
import { app } from '../src/handler/withAuthorizer'

// DynamoDBDocumentClientのモックを作成
const ddbDocumentClientMock = mockClient(DynamoDBDocumentClient)

//
interface MockError {
  message: string
  $metadata: {
    httpStatusCode: number
  }
}

const CustomerBearer =
  'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImR1bW15IiwidHlwIjoiSldUIn0.eyJpc3MiOiJodHRwczovL2NvZ25pdG8taWRwLmFwLW5vcnRoZWFzdC0xLmFtYXpvbmF3cy5jb20vYXAtbm9ydGhlYXN0LTFfYmEzOWJlYzM3NTYzNDE2ZWE5NDI3ZDc3MzdlZjk1N2UiLCJzdWIiOiJiZjE5NWRhYi0wYmMyLTQyMTAtOTY5OC03ZjE5ZjczZThiODUiLCJhdWQiOiJ0eXFrb2QydDUxMnhjZDIydjYycWIyZWNjYiIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzExNDg1NDczLCJleHAiOjE3MTE0ODkwNzMsImNvZ25pdG86dXNlcm5hbWUiOiJDdXN0b21lcjEifQ.jXmMCCoU3n-FXx6CnEjT8JtHUjPvfjQRzqUvGOH56dyT7dtFoRoxvlrLIYDN2n27tGTYxGrCPf2F-q18iPds4_8Mg5GJ6cwBQnZrzShOE1oBmDTLIuAo3nCnwhF7pBA1VufUaVs6SGLtTB57vAQr4o8qeEDeeRETmFh3i146T-alQQnkKD8RQaYcp0Cwkn_k9RLEPYDrgXLzLbqo9t4ltfB9uoa1LFI7-CmrITlveapkLCdTHQazigfe9fMjGDbwJhm-PdSjgncPsWVLplw3rxwRroP9rc3VgqAVutSDf4Nm4QciwFiyd9wzdzLdFEklL1s4a7pzJ_0vSI7r5tKi_Q'

describe('orders api tests', () => {
  beforeEach(() => {
    ddbDocumentClientMock.reset()
  })

  // POST
  it('post return 201', async () => {
    // モック
    ddbDocumentClientMock.on(TransactWriteCommand).resolves({})

    const mockUUID = '123e4567-e89b-12d3-a456-426614174000'
    jest.spyOn(crypto, 'randomUUID').mockImplementation(() => mockUUID)

    // リクエスト
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

    // レスポンス
    const resBody = { id: mockUUID }

    // テスト実行
    await request(app)
      .post('/api/v1/private/orders')
      .set('authorization', CustomerBearer)
      .send(reqBody)
      .expect(201)
      .expect('content-type', /json/)
      .expect(resBody)
  })

  it('post return 400 if lack of required parameters', async () => {
    // モック
    ddbDocumentClientMock.on(TransactWriteCommand).resolves({})

    // リクエスト
    const reqBody = [
      {
        productId: 'ac79f107-4db1-4a88-bd7d-306537fa8b22',
        price: 100,
        quantity: 5,
      },
      {
        // productId: 'rc19f107-as-4a88-bd73-306b37fa8b22',
        price: 200,
        quantity: 15,
      },
    ]

    // レスポンス
    const resBody = {
      message: '必須パラメータが不足しています',
    }

    // テスト実行
    await request(app)
      .post('/api/v1/private/orders')
      .set('authorization', CustomerBearer)
      .send(reqBody)
      .expect(400)
      .expect('content-type', /json/)
      .expect(resBody)
  })

  it('post return 500 if unexpected error', async () => {
    // モック
    const httpStatusCode = 500
    const message = 'unexpected error'
    const mockError: MockError = {
      message,
      $metadata: {
        httpStatusCode,
      },
    }
    ddbDocumentClientMock.on(TransactWriteCommand).rejects(mockError)

    // リクエスト
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

    // レスポンス
    const resBody = { message }

    // テスト実行
    await request(app)
      .post('/api/v1/private/orders')
      .set('authorization', CustomerBearer)
      .send(reqBody)
      .expect(500)
      .expect('content-type', /json/)
      .expect(resBody)
  })

  // GET
  it('get all return 200', async () => {
    // モック
    const mockData = {
      Count: 1,
      Items: [
        {
          sk: 'o#3a614c6c-8da0-4947-91f9-77b934e50348',
          updateAt: '20240406T105315282',
          pk: 'o#3a614c6c-8da0-4947-91f9-77b934e50348',
          entityType: 'order',
          createAt: '20240406T105315282',
        },
      ],
      ScannedCount: 1,
    }
    ddbDocumentClientMock.on(QueryCommand).resolves(mockData)

    // レスポンス
    const resBody = [{ id: '3a614c6c-8da0-4947-91f9-77b934e50348', createAt: '20240406T105315282', updateAt: '20240406T105315282' }]

    // テスト実行
    await request(app).get('/api/v1/private/orders').set('authorization', CustomerBearer).expect(200).expect('content-type', /json/).expect(resBody)
  })

  it('get all return 404 if not found', async () => {
    // モック
    const mockData = {
      Items: [],
      Count: 0,
    }
    ddbDocumentClientMock.on(QueryCommand).resolves(mockData)

    // レスポンス
    const resBody = { message: '指定された情報は存在しません' }

    // テスト実行
    await request(app).get('/api/v1/private/orders').set('authorization', CustomerBearer).expect(404).expect('content-type', /json/).expect(resBody)
  })

  it('get once return 200', async () => {
    // モック
    const mockData = {
      Count: 5,
      Items: [
        {
          sk: 'c#Owner1',
          entityType: 'order2customer',
          pk: 'o#3a614c6c-8da0-4947-91f9-77b934e50348',
        },
        {
          sk: 'o#3a614c6c-8da0-4947-91f9-77b934e50348',
          updateAt: '20240406T105315282',
          pk: 'o#3a614c6c-8da0-4947-91f9-77b934e50348',
          entityType: 'order',
          createAt: '20240406T105315282',
        },
        {
          sk: 'p#ARVrwfZa8F',
          pk: 'o#3a614c6c-8da0-4947-91f9-77b934e50348',
          quantity: '4300',
          entityType: 'order2product',
          price: '4751',
        },
        {
          sk: 'p#mMGiVsO2Xx',
          pk: 'o#3a614c6c-8da0-4947-91f9-77b934e50348',
          quantity: '6272',
          entityType: 'order2product',
          price: '1194',
        },
        {
          sk: 'p#yJUBdK2Z8b',
          pk: 'o#3a614c6c-8da0-4947-91f9-77b934e50348',
          quantity: '275',
          entityType: 'order2product',
          price: '8927',
        },
      ],
      ScannedCount: 5,
    }
    ddbDocumentClientMock.on(QueryCommand).resolves(mockData)

    // レスポンス
    const resBody = {
      customerId: 'Owner1',
      detail: [
        { sk: 'p#ARVrwfZa8F', pk: 'o#3a614c6c-8da0-4947-91f9-77b934e50348', quantity: '4300', entityType: 'order2product', price: '4751' },
        { sk: 'p#mMGiVsO2Xx', pk: 'o#3a614c6c-8da0-4947-91f9-77b934e50348', quantity: '6272', entityType: 'order2product', price: '1194' },
        { sk: 'p#yJUBdK2Z8b', pk: 'o#3a614c6c-8da0-4947-91f9-77b934e50348', quantity: '275', entityType: 'order2product', price: '8927' },
      ],
      date: { createAt: '20240406T105315282', updateAt: '20240406T105315282' },
    }

    // テスト実行
    await request(app)
      .get('/api/v1/private/orders/3a614c6c-8da0-4947-91f9-77b934e50348')
      .set('authorization', CustomerBearer)
      .expect(200)
      .expect('content-type', /json/)
      .expect(resBody)
  })

  it('get once return 404 if not found', async () => {
    // モック
    const mockData = {
      Items: [],
      Count: 0,
    }
    ddbDocumentClientMock.on(QueryCommand).resolves(mockData)

    // レスポンス
    const resBody = { message: '指定された情報は存在しません' }

    // テスト実行
    await request(app)
      .get('/api/v1/private/orders/3a614c6c-8da0-4947-91f9-77b934e50348')
      .set('authorization', CustomerBearer)
      .expect(404)
      .expect('content-type', /json/)
      .expect(resBody)
  })

  // PUT
  it('put return 204', async () => {
    // モック
    const mockData = {
      Count: 5,
      Items: [
        {
          sk: 'c#Owner1',
          entityType: 'order2customer',
          pk: 'o#3a614c6c-8da0-4947-91f9-77b934e50348',
        },
        {
          sk: 'o#3a614c6c-8da0-4947-91f9-77b934e50348',
          updateAt: '20240406T105315282',
          pk: 'o#3a614c6c-8da0-4947-91f9-77b934e50348',
          entityType: 'order',
          createAt: '20240406T105315282',
        },
        {
          sk: 'p#ARVrwfZa8F',
          pk: 'o#3a614c6c-8da0-4947-91f9-77b934e50348',
          quantity: '4300',
          entityType: 'order2product',
          price: '4751',
        },
        {
          sk: 'p#mMGiVsO2Xx',
          pk: 'o#3a614c6c-8da0-4947-91f9-77b934e50348',
          quantity: '6272',
          entityType: 'order2product',
          price: '1194',
        },
        {
          sk: 'p#yJUBdK2Z8b',
          pk: 'o#3a614c6c-8da0-4947-91f9-77b934e50348',
          quantity: '275',
          entityType: 'order2product',
          price: '8927',
        },
      ],
      ScannedCount: 5,
    }
    ddbDocumentClientMock.on(QueryCommand).resolves(mockData)

    // リクエスト
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

    // テスト実行
    await request(app)
      .put('/api/v1/private/orders/3a614c6c-8da0-4947-91f9-77b934e50348')
      .set('authorization', CustomerBearer)
      .send(reqBody)
      .expect(204)
  })

  it('put return 400 if lack of required parameters', async () => {
    // モック
    const mockData = {
      Count: 5,
      Items: [
        {
          sk: 'c#Owner1',
          entityType: 'order2customer',
          pk: 'o#3a614c6c-8da0-4947-91f9-77b934e50348',
        },
        {
          sk: 'o#3a614c6c-8da0-4947-91f9-77b934e50348',
          updateAt: '20240406T105315282',
          pk: 'o#3a614c6c-8da0-4947-91f9-77b934e50348',
          entityType: 'order',
          createAt: '20240406T105315282',
        },
        {
          sk: 'p#ARVrwfZa8F',
          pk: 'o#3a614c6c-8da0-4947-91f9-77b934e50348',
          quantity: '4300',
          entityType: 'order2product',
          price: '4751',
        },
        {
          sk: 'p#mMGiVsO2Xx',
          pk: 'o#3a614c6c-8da0-4947-91f9-77b934e50348',
          quantity: '6272',
          entityType: 'order2product',
          price: '1194',
        },
        {
          sk: 'p#yJUBdK2Z8b',
          pk: 'o#3a614c6c-8da0-4947-91f9-77b934e50348',
          quantity: '275',
          entityType: 'order2product',
          price: '8927',
        },
      ],
      ScannedCount: 5,
    }
    ddbDocumentClientMock.on(QueryCommand).resolves(mockData)

    // リクエスト
    const reqBody = [
      {
        productId: 'ac79f107-4db1-4a88-bd7d-306537fa8b22',
        price: 100,
        quantity: 5,
      },
      {
        // productId: 'rc19f107-as-4a88-bd73-306b37fa8b22',
        price: 200,
        quantity: 15,
      },
    ]
    ddbDocumentClientMock.on(TransactWriteCommand).resolves({})

    // テスト実行
    await request(app)
      .put('/api/v1/private/orders/3a614c6c-8da0-4947-91f9-77b934e50348')
      .set('authorization', CustomerBearer)
      .send(reqBody)
      .expect(400)
  })

  it('put return 404 if not found', async () => {
    // モック
    const mockData = {
      Items: [],
      Count: 0,
    }
    ddbDocumentClientMock.on(QueryCommand).resolves(mockData)

    // リクエスト
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

    // レスポンス
    const resBody = { message: '指定された情報は存在しません' }

    // テスト実行
    await request(app)
      .put('/api/v1/private/orders/2434a641-4c1d-46ea-adcf-e5df70359ab2')
      .set('authorization', CustomerBearer)
      .send(reqBody)
      .expect(404)
      .expect('content-type', /json/)
      .expect(resBody)
  })

  it('put return 500 if unexpected error', async () => {
    // モック
    const mockData = {
      Count: 5,
      Items: [
        {
          sk: 'c#Owner1',
          entityType: 'order2customer',
          pk: 'o#3a614c6c-8da0-4947-91f9-77b934e50348',
        },
        {
          sk: 'o#3a614c6c-8da0-4947-91f9-77b934e50348',
          updateAt: '20240406T105315282',
          pk: 'o#3a614c6c-8da0-4947-91f9-77b934e50348',
          entityType: 'order',
          createAt: '20240406T105315282',
        },
        {
          sk: 'p#ARVrwfZa8F',
          pk: 'o#3a614c6c-8da0-4947-91f9-77b934e50348',
          quantity: '4300',
          entityType: 'order2product',
          price: '4751',
        },
        {
          sk: 'p#mMGiVsO2Xx',
          pk: 'o#3a614c6c-8da0-4947-91f9-77b934e50348',
          quantity: '6272',
          entityType: 'order2product',
          price: '1194',
        },
        {
          sk: 'p#yJUBdK2Z8b',
          pk: 'o#3a614c6c-8da0-4947-91f9-77b934e50348',
          quantity: '275',
          entityType: 'order2product',
          price: '8927',
        },
      ],
      ScannedCount: 5,
    }
    ddbDocumentClientMock.on(QueryCommand).resolves(mockData)

    const httpStatusCode = 500
    const message = 'unexpected error'
    const mockError: MockError = {
      message,
      $metadata: {
        httpStatusCode,
      },
    }
    ddbDocumentClientMock.on(TransactWriteCommand).rejects(mockError)

    // レスポンス
    const resBody = { message }

    // リクエスト
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

    // テスト実行
    await request(app)
      .put('/api/v1/private/orders/3a614c6c-8da0-4947-91f9-77b934e50348')
      .set('authorization', CustomerBearer)
      .send(reqBody)
      .expect(500)
      .expect('content-type', /json/)
      .expect(resBody)
  })

  // DELETE
  it('delete return 204', async () => {
    // モック
    const mockData = {
      Count: 5,
      Items: [
        {
          sk: 'c#Owner1',
          entityType: 'order2customer',
          pk: 'o#3a614c6c-8da0-4947-91f9-77b934e50348',
        },
        {
          sk: 'o#3a614c6c-8da0-4947-91f9-77b934e50348',
          updateAt: '20240406T105315282',
          pk: 'o#3a614c6c-8da0-4947-91f9-77b934e50348',
          entityType: 'order',
          createAt: '20240406T105315282',
        },
        {
          sk: 'p#ARVrwfZa8F',
          pk: 'o#3a614c6c-8da0-4947-91f9-77b934e50348',
          quantity: '4300',
          entityType: 'order2product',
          price: '4751',
        },
        {
          sk: 'p#mMGiVsO2Xx',
          pk: 'o#3a614c6c-8da0-4947-91f9-77b934e50348',
          quantity: '6272',
          entityType: 'order2product',
          price: '1194',
        },
        {
          sk: 'p#yJUBdK2Z8b',
          pk: 'o#3a614c6c-8da0-4947-91f9-77b934e50348',
          quantity: '275',
          entityType: 'order2product',
          price: '8927',
        },
      ],
      ScannedCount: 5,
    }
    ddbDocumentClientMock.on(QueryCommand).resolves(mockData)
    ddbDocumentClientMock.on(TransactWriteCommand).resolves({})

    // テスト実行
    await request(app).delete('/api/v1/private/orders/3a614c6c-8da0-4947-91f9-77b934e50348').set('authorization', CustomerBearer).expect(204)
  })

  it('delete return 404 if not found', async () => {
    // モック
    const mockData = {
      Items: [],
      Count: 0,
    }
    ddbDocumentClientMock.on(QueryCommand).resolves(mockData)
    ddbDocumentClientMock.on(TransactWriteCommand).resolves({})

    // リクエスト
    const resBody = { message: '指定された情報は存在しません' }

    // テスト実行
    await request(app)
      .delete('/api/v1/private/orders/3a614c6c-8da0-4947-91f9-77b934e50348')
      .set('authorization', CustomerBearer)
      .expect(404)
      .expect('content-type', /json/)
      .expect(resBody)
  })

  it('delete return 500 if unexpected error', async () => {
    // モック
    const mockData = {
      Count: 5,
      Items: [
        {
          sk: 'c#Owner1',
          entityType: 'order2customer',
          pk: 'o#3a614c6c-8da0-4947-91f9-77b934e50348',
        },
        {
          sk: 'o#3a614c6c-8da0-4947-91f9-77b934e50348',
          updateAt: '20240406T105315282',
          pk: 'o#3a614c6c-8da0-4947-91f9-77b934e50348',
          entityType: 'order',
          createAt: '20240406T105315282',
        },
        {
          sk: 'p#ARVrwfZa8F',
          pk: 'o#3a614c6c-8da0-4947-91f9-77b934e50348',
          quantity: '4300',
          entityType: 'order2product',
          price: '4751',
        },
        {
          sk: 'p#mMGiVsO2Xx',
          pk: 'o#3a614c6c-8da0-4947-91f9-77b934e50348',
          quantity: '6272',
          entityType: 'order2product',
          price: '1194',
        },
        {
          sk: 'p#yJUBdK2Z8b',
          pk: 'o#3a614c6c-8da0-4947-91f9-77b934e50348',
          quantity: '275',
          entityType: 'order2product',
          price: '8927',
        },
      ],
      ScannedCount: 5,
    }
    ddbDocumentClientMock.on(QueryCommand).resolves(mockData)

    const httpStatusCode = 500
    const message = 'unexpected error'
    const mockError: MockError = {
      message,
      $metadata: {
        httpStatusCode,
      },
    }
    ddbDocumentClientMock.on(TransactWriteCommand).rejects(mockError)

    // レスポンス
    const resBody = { message }

    // テスト実行
    await request(app)
      .delete('/api/v1/private/orders/2434a641-4c1d-46ea-adcf-e5df70359ab2')
      .set('authorization', CustomerBearer)
      .expect(500)
      .expect('content-type', /json/)
      .expect(resBody)
  })

  // Common
  it('return 400 if unsupported method', async () => {
    // レスポンス
    const resBody = { message: '未サポートのオペレーションです' }

    // テスト実行
    await request(app).trace('/api/v1/private/orders').set('authorization', CustomerBearer).expect(400).expect('content-type', /json/).expect(resBody)
  })

  it('return 404 if unsuppted Endpoint', async () => {
    // レスポンス
    const resBody = { message: '未サポートのAPIです' }

    // テスト実行
    await request(app)
      .post('/api/v1/private/unsuppted')
      .set('authorization', CustomerBearer)
      .expect(404)
      .expect('content-type', /json/)
      .expect(resBody)
  })
})
