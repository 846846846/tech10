import request from 'supertest'
import { mockClient } from 'aws-sdk-client-mock'
import { CognitoIdentityProviderClient, SignUpCommand } from '@aws-sdk/client-cognito-identity-provider'
import { app } from '../../src/handler/withoutAuthorizer'

// CognitoIdentityProviderClientのモック作成
const cognitoIdentityProviderClientMock = mockClient(CognitoIdentityProviderClient)

describe('withoutAuthorizer handler tests', () => {
  beforeEach(() => {
    cognitoIdentityProviderClientMock.reset()
  })

  it('health should return 200', async () => {
    await request(app).get('/api/v1/public/health').expect(200).expect('Content-Type', /json/).expect({ message: 'Hello World!!' })
  })

  it('users should return 200', async () => {
    const reqBody = { name: 'Owner1', email: 'Owner1@test.com', password: '12345678', role: 'Owner' }
    cognitoIdentityProviderClientMock.on(SignUpCommand).resolves({})

    await request(app)
      .post('/api/v1/public/users/signup')
      .send(reqBody)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect({ message: 'User has been signed up!' })
  })

  it('users return 400 if unsupported action', async () => {
    const reqBody = { name: 'Owner1', email: 'Owner1@test.com', password: '12345678', role: 'Owner' }
    cognitoIdentityProviderClientMock.on(SignUpCommand).resolves({})

    await request(app)
      .post('/api/v1/public/users/dummy')
      .send(reqBody)
      .expect(400)
      .expect('Content-Type', /json/)
      .expect({ message: '未サポートのアクションです' })
  })

  it('unsuppted API should handle error', async () => {
    await request(app).post('/api/v1/public/unsuppted').send({}).expect('content-type', /json/).expect(404).expect({ message: '未サポートのAPIです' })
  })
})
