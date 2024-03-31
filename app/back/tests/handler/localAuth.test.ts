import { handler } from '../../src/handler/localAuth'

describe('localAuth handler tests', () => {
  it('should return the correct policy document', async () => {
    const event = { methodArn: 'arn:aws:execute-api:region:accountId:apiId/stage/method/resourcePath' }
    const expectedResponse = {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: 'arn:aws:execute-api:region:accountId:apiId/stage/method/resourcePath',
          },
        ],
      },
    }

    const result = await handler(event)

    expect(result).toEqual(expectedResponse)
  })
})
