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

describe('products api tests', () => {
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
    const reqBody = {
      name: 'FxSCgLyyAG',
      owner: 'Owner1',
      explanation: 'Gp3QMKEwR9ZiWfMacWksuzAFb0OiRQ0gz34XiQm0E0a0tw8x9XlXlvERQ2TcWZDKB1MfOcOMOrdSGYkPWPvVCZ25PbHbxWu8YmdO',
      price: '2896',
      image: ['Owner1/20240406T091624461_Healslime.png'],
      category: 'pH2uhV3l7chXViBsfTdQOeEN84IOeL',
    }

    // レスポンス
    const resBody = {
      id: mockUUID,
    }

    // テスト実行
    await request(app)
      .post('/api/v1/private/products')
      .set('authorization', CustomerBearer)
      .send(reqBody)
      .expect(201)
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
    const reqBody = {
      name: 'FxSCgLyyAG',
      owner: 'Owner1',
      explanation: 'Gp3QMKEwR9ZiWfMacWksuzAFb0OiRQ0gz34XiQm0E0a0tw8x9XlXlvERQ2TcWZDKB1MfOcOMOrdSGYkPWPvVCZ25PbHbxWu8YmdO',
      price: '2896',
      image: ['Owner1/20240406T091624461_Healslime.png'],
      category: 'pH2uhV3l7chXViBsfTdQOeEN84IOeL',
    }

    // レスポンス
    const resBody = { message }

    // テスト実行
    await request(app)
      .post('/api/v1/private/products')
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
      Items: [
        {
          entityType: 'product',
          price: '111',
          sk: 'p#2434a641-4c1d-46ea-adcf-e5df70359ab2',
          updateAt: '2024-03-28T07:06:38+09:00',
          pk: 'p#2434a641-4c1d-46ea-adcf-e5df70359ab2',
          detail: {
            name: '111',
            image: ['Owner1/20240328T070638039_Healslime.png'],
            explanation: '111',
            category: '111',
          },
          createAt: '2024-03-28T07:06:38+09:00',
        },
      ],
      Count: 1,
    }
    ddbDocumentClientMock.on(QueryCommand).resolves(mockData)

    // レスポンス
    const resBody = [
      {
        id: '2434a641-4c1d-46ea-adcf-e5df70359ab2',
        price: '111',
        name: '111',
        image: ['Owner1/20240328T070638039_Healslime.png'],
        createAt: '2024-03-28T07:06:38+09:00',
        updateAt: '2024-03-28T07:06:38+09:00',
      },
    ]
    // テスト実行
    await request(app).get('/api/v1/private/products').set('authorization', CustomerBearer).expect(200).expect('content-type', /json/).expect(resBody)
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
    await request(app).get('/api/v1/private/products').set('authorization', CustomerBearer).expect(404).expect('content-type', /json/).expect(resBody)
  })

  it('get all return 500 if unexpected error (and offline)', async () => {
    // モック
    const httpStatusCode = 500
    const message = 'unexpected error'
    const mockError: MockError = {
      message,
      $metadata: {
        httpStatusCode,
      },
    }
    ddbDocumentClientMock.on(QueryCommand).rejects(mockError)

    // 環境変数操作
    process.env.IS_OFFLINE = 'true'

    // レスポンス
    const resBody = { message }
    // テスト実行
    await request(app).get('/api/v1/private/products').set('authorization', CustomerBearer).expect(500).expect('content-type', /json/).expect(resBody)

    // 環境変数を元に戻す
    process.env.IS_OFFLINE = undefined
  })

  it('get once return 200', async () => {
    // モック
    const mockData = {
      Count: 2,
      Items: [
        {
          sk: 'ow#Owner1',
          entityType: 'product2owner',
          pk: 'p#2434a641-4c1d-46ea-adcf-e5df70359ab2',
        },
        {
          entityType: 'product',
          price: '111',
          sk: 'p#2434a641-4c1d-46ea-adcf-e5df70359ab2',
          updateAt: '2024-03-28T07:06:38+09:00',
          pk: 'p#2434a641-4c1d-46ea-adcf-e5df70359ab2',
          detail: {
            name: '111',
            image: ['Owner1/20240328T070638039_Healslime.png'],
            explanation: '111',
            category: '111',
          },
          createAt: '2024-03-28T07:06:38+09:00',
        },
      ],
      ScannedCount: 2,
    }
    ddbDocumentClientMock.on(QueryCommand).resolves(mockData)

    // レスポンス
    const resBody = {
      id: '2434a641-4c1d-46ea-adcf-e5df70359ab2',
      name: '111',
      price: '111',
      image: ['Owner1/20240328T070638039_Healslime.png'],
      explanation: '111',
      category: '111',
      createAt: '2024-03-28T07:06:38+09:00',
      updateAt: '2024-03-28T07:06:38+09:00',
      owner: 'ow#Owner1',
    }

    // テスト実行
    await request(app)
      .get('/api/v1/private/products/2434a641-4c1d-46ea-adcf-e5df70359ab2')
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
      .get('/api/v1/private/products/12345')
      .set('authorization', CustomerBearer)
      .expect(404)
      .expect('content-type', /json/)
      .expect(resBody)
  })

  // PUT
  it('put return 204', async () => {
    // モック
    const mockData = {
      Count: 2,
      Items: [
        {
          sk: 'ow#Owner1',
          entityType: 'product2owner',
          pk: 'p#2434a641-4c1d-46ea-adcf-e5df70359ab2',
        },
        {
          entityType: 'product',
          price: '111',
          sk: 'p#2434a641-4c1d-46ea-adcf-e5df70359ab2',
          updateAt: '2024-03-28T07:06:38+09:00',
          pk: 'p#2434a641-4c1d-46ea-adcf-e5df70359ab2',
          detail: {
            name: '111',
            image: ['Owner1/20240328T070638039_Healslime.png'],
            explanation: '111',
            category: '111',
          },
          createAt: '2024-03-28T07:06:38+09:00',
        },
      ],
      ScannedCount: 2,
    }
    ddbDocumentClientMock.on(QueryCommand).resolves(mockData)

    // リクエスト
    const reqBody = {
      name: 'FxSCgLyyAG',
      owner: 'Owner1',
      explanation: 'Gp3QMKEwR9ZiWfMacWksuzAFb0OiRQ0gz34XiQm0E0a0tw8x9XlXlvERQ2TcWZDKB1MfOcOMOrdSGYkPWPvVCZ25PbHbxWu8YmdO',
      price: '2896',
      image: ['Owner1/20240406T091624461_Healslime.png'],
      category: 'pH2uhV3l7chXViBsfTdQOeEN84IOeL',
    }
    ddbDocumentClientMock.on(TransactWriteCommand).resolves({})

    // テスト実行
    await request(app)
      .put('/api/v1/private/products/2434a641-4c1d-46ea-adcf-e5df70359ab2')
      .set('authorization', CustomerBearer)
      .send(reqBody)
      .expect(204)
  })

  it('put return 404 if not found', async () => {
    // モック
    const mockData = {
      Items: [],
      Count: 0,
    }
    ddbDocumentClientMock.on(QueryCommand).resolves(mockData)

    // リクエスト
    const reqBody = {
      name: 'FxSCgLyyAG',
      owner: 'Owner1',
      explanation: 'Gp3QMKEwR9ZiWfMacWksuzAFb0OiRQ0gz34XiQm0E0a0tw8x9XlXlvERQ2TcWZDKB1MfOcOMOrdSGYkPWPvVCZ25PbHbxWu8YmdO',
      price: '2896',
      image: ['Owner1/20240406T091624461_Healslime.png'],
      category: 'pH2uhV3l7chXViBsfTdQOeEN84IOeL',
    }
    ddbDocumentClientMock.on(TransactWriteCommand).resolves({})

    // レスポンス
    const resBody = { message: '指定された情報は存在しません' }

    // テスト実行
    await request(app)
      .put('/api/v1/private/products/2434a641-4c1d-46ea-adcf-e5df70359ab2')
      .set('authorization', CustomerBearer)
      .send(reqBody)
      .expect(404)
      .expect('content-type', /json/)
      .expect(resBody)
  })

  it('put return 500 if unexpected error', async () => {
    // モック
    const mockData = {
      Count: 2,
      Items: [
        {
          sk: 'ow#Owner1',
          entityType: 'product2owner',
          pk: 'p#2434a641-4c1d-46ea-adcf-e5df70359ab2',
        },
        {
          entityType: 'product',
          price: '111',
          sk: 'p#2434a641-4c1d-46ea-adcf-e5df70359ab2',
          updateAt: '2024-03-28T07:06:38+09:00',
          pk: 'p#2434a641-4c1d-46ea-adcf-e5df70359ab2',
          detail: {
            name: '111',
            image: ['Owner1/20240328T070638039_Healslime.png'],
            explanation: '111',
            category: '111',
          },
          createAt: '2024-03-28T07:06:38+09:00',
        },
      ],
      ScannedCount: 2,
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

    // リクエスト
    const reqBody = {
      name: 'FxSCgLyyAG',
      owner: 'Owner1',
      explanation: 'Gp3QMKEwR9ZiWfMacWksuzAFb0OiRQ0gz34XiQm0E0a0tw8x9XlXlvERQ2TcWZDKB1MfOcOMOrdSGYkPWPvVCZ25PbHbxWu8YmdO',
      price: '2896',
      image: ['Owner1/20240406T091624461_Healslime.png'],
      category: 'pH2uhV3l7chXViBsfTdQOeEN84IOeL',
    }

    // レスポンス
    const resBody = { message }

    // テスト実行
    await request(app)
      .put('/api/v1/private/products/2434a641-4c1d-46ea-adcf-e5df70359ab2')
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
      Count: 2,
      Items: [
        {
          sk: 'ow#Owner1',
          entityType: 'product2owner',
          pk: 'p#2434a641-4c1d-46ea-adcf-e5df70359ab2',
        },
        {
          entityType: 'product',
          price: '111',
          sk: 'p#2434a641-4c1d-46ea-adcf-e5df70359ab2',
          updateAt: '2024-03-28T07:06:38+09:00',
          pk: 'p#2434a641-4c1d-46ea-adcf-e5df70359ab2',
          detail: {
            name: '111',
            image: ['Owner1/20240328T070638039_Healslime.png'],
            explanation: '111',
            category: '111',
          },
          createAt: '2024-03-28T07:06:38+09:00',
        },
      ],
      ScannedCount: 2,
    }
    ddbDocumentClientMock.on(QueryCommand).resolves(mockData)
    ddbDocumentClientMock.on(TransactWriteCommand).resolves({})

    // テスト実行
    await request(app).delete('/api/v1/private/products/2434a641-4c1d-46ea-adcf-e5df70359ab2').set('authorization', CustomerBearer).expect(204)
  })

  it('delete return 404 if not found', async () => {
    // モック
    const mockData = {
      Items: [],
      Count: 0,
    }
    ddbDocumentClientMock.on(QueryCommand).resolves(mockData)
    ddbDocumentClientMock.on(TransactWriteCommand).resolves({})

    // レスポンス
    const resBody = { message: '指定された情報は存在しません' }

    // テスト実行
    await request(app)
      .delete('/api/v1/private/products/2434a641-4c1d-46ea-adcf-e5df70359ab2')
      .set('authorization', CustomerBearer)
      .expect(404)
      .expect('content-type', /json/)
      .expect(resBody)
  })

  it('delete return 500 if unexpected error', async () => {
    // モック
    const mockData = {
      Count: 2,
      Items: [
        {
          sk: 'ow#Owner1',
          entityType: 'product2owner',
          pk: 'p#2434a641-4c1d-46ea-adcf-e5df70359ab2',
        },
        {
          entityType: 'product',
          price: '111',
          sk: 'p#2434a641-4c1d-46ea-adcf-e5df70359ab2',
          updateAt: '2024-03-28T07:06:38+09:00',
          pk: 'p#2434a641-4c1d-46ea-adcf-e5df70359ab2',
          detail: {
            name: '111',
            image: ['Owner1/20240328T070638039_Healslime.png'],
            explanation: '111',
            category: '111',
          },
          createAt: '2024-03-28T07:06:38+09:00',
        },
      ],
      ScannedCount: 2,
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
      .delete('/api/v1/private/products/2434a641-4c1d-46ea-adcf-e5df70359ab2')
      .set('authorization', CustomerBearer)
      .expect(500)
      .expect('content-type', /json/)
      .expect(resBody)
  })

  // Common
  it('return 400 if unsupported operation', async () => {
    // レスポンス
    const resBody = { message: '未サポートのオペレーションです' }

    // テスト実行
    await request(app)
      .trace('/api/v1/private/products')
      .set('authorization', CustomerBearer)
      .expect(400)
      .expect('content-type', /json/)
      .expect(resBody)
  })

  it('return 404 if unsuppted API', async () => {
    // レスポンス
    const resBody = { message: '未サポートのAPIです' }

    // テスト実行
    await request(app)
      .post('/api/v1/private/unsuppted')
      .set('authorization', CustomerBearer)
      .expect('content-type', /json/)
      .expect(404)
      .expect(resBody)
  })
})
