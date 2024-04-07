import request from 'supertest'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { app as appWithout } from '../src/handler/withoutAuthorizer'
import { app as appWith } from '../src/handler/withAuthorizer'

// AWS SDKをモック化
jest.mock('@aws-sdk/client-s3')
jest.mock('@aws-sdk/s3-request-presigner')

// 型キャスティングでjest.Mockを使用
const mockedGetSignedUrl = getSignedUrl as jest.MockedFunction<typeof getSignedUrl>

//
interface MockError {
  message: string
  $metadata: {
    httpStatusCode: number
  }
}

const CustomerBearer =
  'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImR1bW15IiwidHlwIjoiSldUIn0.eyJpc3MiOiJodHRwczovL2NvZ25pdG8taWRwLmFwLW5vcnRoZWFzdC0xLmFtYXpvbmF3cy5jb20vYXAtbm9ydGhlYXN0LTFfYmEzOWJlYzM3NTYzNDE2ZWE5NDI3ZDc3MzdlZjk1N2UiLCJzdWIiOiJiZjE5NWRhYi0wYmMyLTQyMTAtOTY5OC03ZjE5ZjczZThiODUiLCJhdWQiOiJ0eXFrb2QydDUxMnhjZDIydjYycWIyZWNjYiIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzExNDg1NDczLCJleHAiOjE3MTE0ODkwNzMsImNvZ25pdG86dXNlcm5hbWUiOiJDdXN0b21lcjEifQ.jXmMCCoU3n-FXx6CnEjT8JtHUjPvfjQRzqUvGOH56dyT7dtFoRoxvlrLIYDN2n27tGTYxGrCPf2F-q18iPds4_8Mg5GJ6cwBQnZrzShOE1oBmDTLIuAo3nCnwhF7pBA1VufUaVs6SGLtTB57vAQr4o8qeEDeeRETmFh3i146T-alQQnkKD8RQaYcp0Cwkn_k9RLEPYDrgXLzLbqo9t4ltfB9uoa1LFI7-CmrITlveapkLCdTHQazigfe9fMjGDbwJhm-PdSjgncPsWVLplw3rxwRroP9rc3VgqAVutSDf4Nm4QciwFiyd9wzdzLdFEklL1s4a7pzJ_0vSI7r5tKi_Q'

describe('meta api tests', () => {
  // health
  it('health should return 200', async () => {
    // レスポンス
    const resBody = { message: 'Hello World!!' }

    // テスト実行
    await request(appWithout).get('/api/v1/public/meta/health').expect(200).expect('Content-Type', /json/).expect(resBody)
  })

  // presignedUrl
  it('presignedUrl should return 200 case download', async () => {
    // モック
    const url = 'mocked-upload-url'
    mockedGetSignedUrl.mockResolvedValue(url)

    // リクエスト
    const reqQuery = { name: 'value1', type: 'value2' }

    // レスポンス
    const resBody = { url }

    // テスト実行
    await request(appWith)
      .get('/api/v1/private/meta/presignedUrl')
      .query(reqQuery)
      .set('authorization', CustomerBearer)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(resBody)
  })

  it('presignedUrl should return 200 case upload', async () => {
    // モック
    const url = 'mocked-upload-url'
    mockedGetSignedUrl.mockResolvedValue(url)

    // リクエスト
    const reqQuery = { name: 'value1', type: 'value2', upload: true }

    // レスポンス
    const resBody = { url }

    // テスト実行
    await request(appWith)
      .get('/api/v1/private/meta/presignedUrl')
      .query(reqQuery)
      .set('authorization', CustomerBearer)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(resBody)
  })

  it('presignedUrl should return 200 case offline', async () => {
    // モック
    const url = 'mocked-upload-url'
    mockedGetSignedUrl.mockResolvedValue(url)

    // 環境変数操作
    process.env.IS_OFFLINE = 'true'

    // リクエスト
    const reqQuery = { name: 'value1', type: 'value2' }

    // レスポンス
    const resBody = { url }

    // テスト実行
    await request(appWith)
      .get('/api/v1/private/meta/presignedUrl')
      .query(reqQuery)
      .set('authorization', CustomerBearer)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(resBody)

    // 環境変数を元に戻す
    process.env.IS_OFFLINE = undefined
  })

  it('presignedUrl should return 500 if fails', async () => {
    // モック
    const httpStatusCode = 500
    const message = 'mocked error'
    const mockError: MockError = {
      message,
      $metadata: {
        httpStatusCode,
      },
    }
    mockedGetSignedUrl.mockRejectedValue(mockError)

    // リクエスト
    const reqQuery = { name: 'value1', type: 'value2' }

    // レスポンス
    const resBody = { message }

    // テスト実行
    await request(appWith)
      .get('/api/v1/private/meta/presignedUrl')
      .query(reqQuery)
      .set('authorization', CustomerBearer)
      .expect(500)
      .expect('Content-Type', /json/)
      .expect(resBody)
  })

  // Common
  it('return 400 if unsupported operation', async () => {
    // レスポンス
    const resBody = { message: '未サポートのオペレーションです' }

    // テスト実行
    await request(appWith)
      .trace('/api/v1/private/meta/dummy')
      .set('authorization', CustomerBearer)
      .expect(400)
      .expect('content-type', /json/)
      .expect(resBody)
  })
})
