import request from 'supertest'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { app } from '../../src/handler/withAuthorizer'

// AWS SDKをモック化
jest.mock('@aws-sdk/client-s3')
jest.mock('@aws-sdk/s3-request-presigner')

// 型キャスティングでjest.Mockを使用
const mockedGetSignedUrl = getSignedUrl as jest.MockedFunction<typeof getSignedUrl>

const CustomerBearer =
  'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImR1bW15IiwidHlwIjoiSldUIn0.eyJpc3MiOiJodHRwczovL2NvZ25pdG8taWRwLmFwLW5vcnRoZWFzdC0xLmFtYXpvbmF3cy5jb20vYXAtbm9ydGhlYXN0LTFfYmEzOWJlYzM3NTYzNDE2ZWE5NDI3ZDc3MzdlZjk1N2UiLCJzdWIiOiJiZjE5NWRhYi0wYmMyLTQyMTAtOTY5OC03ZjE5ZjczZThiODUiLCJhdWQiOiJ0eXFrb2QydDUxMnhjZDIydjYycWIyZWNjYiIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzExNDg1NDczLCJleHAiOjE3MTE0ODkwNzMsImNvZ25pdG86dXNlcm5hbWUiOiJDdXN0b21lcjEifQ.jXmMCCoU3n-FXx6CnEjT8JtHUjPvfjQRzqUvGOH56dyT7dtFoRoxvlrLIYDN2n27tGTYxGrCPf2F-q18iPds4_8Mg5GJ6cwBQnZrzShOE1oBmDTLIuAo3nCnwhF7pBA1VufUaVs6SGLtTB57vAQr4o8qeEDeeRETmFh3i146T-alQQnkKD8RQaYcp0Cwkn_k9RLEPYDrgXLzLbqo9t4ltfB9uoa1LFI7-CmrITlveapkLCdTHQazigfe9fMjGDbwJhm-PdSjgncPsWVLplw3rxwRroP9rc3VgqAVutSDf4Nm4QciwFiyd9wzdzLdFEklL1s4a7pzJ_0vSI7r5tKi_Q'

describe('withAuthorizer tests', () => {
  describe('GET /api/v1/private/presigned-url', () => {
    beforeEach(() => {
      mockedGetSignedUrl.mockReset()
    })

    it('should return presigned URL', async () => {
      const expectedValue = 'mocked-upload-url'
      mockedGetSignedUrl.mockResolvedValue(expectedValue)

      await request(app)
        .get('/api/v1/private/presigned-url')
        .query({ name: 'value1', type: 'value2' })
        .set('authorization', CustomerBearer)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect({ url: expectedValue })
    })

    it('should return presigned URL error case', async () => {
      const expectedValue = 'getSignedUrl error'
      mockedGetSignedUrl.mockRejectedValue(new Error(expectedValue))

      await request(app)
        .get('/api/v1/private/presigned-url')
        .query({ name: 'value1', type: 'value2' })
        .set('authorization', CustomerBearer)
        .expect(500)
        .expect('Content-Type', /json/)
        .expect({ message: expectedValue })
    })
  })

  describe('POST /api/v1/private/products', () => {
    it('should handle product creation', async () => {
      const productData = { name: 'Test Product', price: 100 }

      const response = await request(app)
        .post('/api/v1/private/products')
        .set('authorization', CustomerBearer)
        .send(productData)
        .expect('content-type', /json/)
        .expect(200)

      expect(response.body).toHaveProperty('id')
    })
  })

  // 他のエンドポイントに対するテストケースも同様に追加...
})
