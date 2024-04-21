export async function handler(event) {
  // [TOFO] motoと連携して認証
  console.log(event)
  return {
    principalId: 'user',
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: event.methodArn,
        },
      ],
    },
  }
}
