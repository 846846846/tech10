import request from 'supertest'
import { mockClient } from 'aws-sdk-client-mock'
import { CognitoIdentityProviderClient, SignUpCommand, ConfirmSignUpCommand, InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider'
import { app } from '../src/handler/withoutAuthorizer'

// CognitoIdentityProviderClientのモック作成
const cognitoIdentityProviderClientMock = mockClient(CognitoIdentityProviderClient)

//
interface MockError {
  message: string
  $metadata: {
    httpStatusCode: number
  }
}

describe('users api tests', () => {
  beforeEach(() => {
    cognitoIdentityProviderClientMock.reset()
  })

  // signup
  it('signup should return 200', async () => {
    // モック
    cognitoIdentityProviderClientMock.on(SignUpCommand).resolves({})

    // リクエスト
    const reqBody = { name: 'Owner1', email: 'Owner1@test.com', password: '12345678', role: 'Owner' }

    // レスポンス
    const resBody = { message: 'User has been signed up!' }

    // テスト実行
    await request(app).post('/api/v1/public/users/signup').send(reqBody).expect(200).expect('Content-Type', /json/).expect(resBody)
  })

  it('signup should return 500 if unexpected error', async () => {
    // モック
    const httpStatusCode = 500
    const message = 'unexpected error'
    const mockError: MockError = {
      message,
      $metadata: {
        httpStatusCode,
      },
    }
    cognitoIdentityProviderClientMock.on(SignUpCommand).rejects(mockError)

    // リクエスト
    const reqBody = { name: 'Owner1', email: 'Owner1@test.com', password: '12345678', role: 'Owner' }

    // レスポンス
    const resBody = { message }

    // テスト実行
    await request(app).post('/api/v1/public/users/signup').send(reqBody).expect(500).expect('Content-Type', /json/).expect(resBody)
  })

  // confirmSignup
  it('confirmSignup should return 200', async () => {
    // モック
    cognitoIdentityProviderClientMock.on(ConfirmSignUpCommand).resolves({})

    // リクエスト
    const reqBody = { name: 'samlple', confirmationCode: 752763 }

    // レスポンス
    const resBody = { message: 'User has been activate!' }

    // テスト実行
    await request(app).post('/api/v1/public/users/confirmSignup').send(reqBody).expect(200).expect('Content-Type', /json/).expect(resBody)
  })

  it('confirmSignup should return 500 if unexpected error', async () => {
    // モック
    const httpStatusCode = 500
    const message = 'unexpected error'
    const mockError: MockError = {
      message,
      $metadata: {
        httpStatusCode,
      },
    }
    cognitoIdentityProviderClientMock.on(ConfirmSignUpCommand).rejects(mockError)

    // リクエスト
    const reqBody = { name: 'samlple', confirmationCode: 752763 }

    // レスポンス
    const resBody = { message }

    // テスト実行
    await request(app).post('/api/v1/public/users/confirmSignup').send(reqBody).expect(500).expect('Content-Type', /json/).expect(resBody)
  })

  // signin
  it('signin should return 200', async () => {
    // モック
    const mockData = {
      IdToken:
        'eyJhbGciOiJSUzI1NiIsImtpZCI6ImR1bW15IiwidHlwIjoiSldUIn0.eyJpc3MiOiJodHRwczovL2NvZ25pdG8taWRwLmFwLW5vcnRoZWFzdC0xLmFtYXpvbmF3cy5jb20vYXAtbm9ydGhlYXN0LTFfYmEzOWJlYzM3NTYzNDE2ZWE5NDI3ZDc3MzdlZjk1N2UiLCJzdWIiOiIwZGFhYjJlYi0yZGM5LTQ1ZDktODExYi0yMmNkZWViMTkzNDciLCJhdWQiOiJ0eXFrb2QydDUxMnhjZDIydjYycWIyZWNjYiIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzEyNDYyMjI1LCJleHAiOjE3MTI0NjU4MjUsImNvZ25pdG86dXNlcm5hbWUiOiJPd25lcjEifQ.QNeIPniCX7sLKlw-_yIR_ZpcfBl68f9FR6bEKmsBXXTms3j9nC1wGsm8HbhZi1YmnNmjIeE0PjIqfEjTD55M7VfZby-6lp8DKwR3ONnEsTKI2lC_cHV3hsNDou4iKCZNbjeJpg1WTtVosf06O2AfR3dszKJh4vRO3ANDYnO8Eym5D0sxVOCAto3RqylpplgdTUDWeJzxUprTix2JBkwBObiv1Nw3FwqTRwbAfcZYuuifaSEmVpaepurCaYVSBIU5KWKtxNhsTlwxroNE0YKhtHZXaCpmaUHoZf3zmR3prz3s_RlRINy0duwYSX5N1KmxTdqAZxsj-6Z9kcnpel9Flw',
      AccessToken:
        'eyJhbGciOiJSUzI1NiIsImtpZCI6ImR1bW15IiwidHlwIjoiSldUIn0.eyJpc3MiOiJodHRwczovL2NvZ25pdG8taWRwLmFwLW5vcnRoZWFzdC0xLmFtYXpvbmF3cy5jb20vYXAtbm9ydGhlYXN0LTFfYmEzOWJlYzM3NTYzNDE2ZWE5NDI3ZDc3MzdlZjk1N2UiLCJzdWIiOiIwZGFhYjJlYi0yZGM5LTQ1ZDktODExYi0yMmNkZWViMTkzNDciLCJjbGllbnRfaWQiOiJ0eXFrb2QydDUxMnhjZDIydjYycWIyZWNjYiIsInRva2VuX3VzZSI6ImFjY2VzcyIsImF1dGhfdGltZSI6MTcxMjQ2MjIyNCwiZXhwIjoxNzEyNDY1ODI0LCJ1c2VybmFtZSI6Ik93bmVyMSJ9.ZDazeBOVO_2TRnF3ODDuRDEdQP9tgFdinDIIr0ifj1uNdpmggJnAAZ0Yqze2G19x0x8wyj5vzd42Bt3eLMuIMeTbEgc2B-fBKCCKzyRn5aPki58llri90BHZDuXJgA1EidcrObqCGaxgHZKp6IIGnJATVgmP5oNZHTdQUx3B2fef0LR7Sh1nL-eUbP0nrQKdw5PxNjjZF_q1u-PiLcHjB2TzbbDVHQRZJOboGr6DwJkcpNfAcLeiB2QVFhyXGYFPChS4hLusCes1we4R5_4YSG0cg8UXWuqNggNH7K9LbXkm7Rpv4NT_DfVCapDy7hiM77_lWYVMBrNdcoJgZwo66g',
      ExpiresIn: 3600,
      RefreshToken: '846e1324-22e5-46a6-8f1a-5f63184bfba1',
      TokenType: 'Bearer',
    }
    cognitoIdentityProviderClientMock.on(InitiateAuthCommand).resolves({ AuthenticationResult: mockData })

    // リクエスト
    const reqBody = { name: 'samlple', password: 'a1faS112' }

    // レスポンス
    const resBody = mockData

    // テスト実行
    await request(app).post('/api/v1/public/users/signin').send(reqBody).expect(200).expect('Content-Type', /json/).expect(resBody)
  })

  it('signin should return 500 if unexpected error (and offline)', async () => {
    // モック
    const httpStatusCode = 500
    const message = 'unexpected error'
    const mockError: MockError = {
      message,
      $metadata: {
        httpStatusCode,
      },
    }
    cognitoIdentityProviderClientMock.on(InitiateAuthCommand).rejects(mockError)

    // 環境変数操作
    process.env.IS_OFFLINE = 'true'

    // リクエスト
    const reqBody = { name: 'samlple', password: 'a1faS112' }

    // レスポンス
    const resBody = { message }

    // テスト実行
    await request(app).post('/api/v1/public/users/signin').send(reqBody).expect(500).expect('Content-Type', /json/).expect(resBody)

    // 環境変数を元に戻す
    process.env.IS_OFFLINE = undefined
  })

  // Common
  it('return 400 if unsupported operation', async () => {
    // レスポンス
    const resBody = { message: '未サポートのオペレーションです' }

    // テスト実行
    await request(app).post('/api/v1/public/users/unsuppted').expect(400).expect('content-type', /json/).expect(resBody)
  })

  it('return 404 if unsuppted API', async () => {
    // レスポンス
    const resBody = { message: '未サポートのAPIです' }

    // テスト実行
    await request(app).post('/api/v1/public/unsuppted').expect(404).expect('content-type', /json/).expect(resBody)
  })
})
