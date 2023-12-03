import { Request } from 'express'
import {
  CognitoIdentityProviderClient,
  AuthFlowType,
  SignUpCommand,
  SignUpCommandInput,
  SignUpCommandOutput,
  ConfirmSignUpCommand,
  ConfirmSignUpCommandInput,
  ConfirmSignUpCommandOutput,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
  InitiateAuthCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider'

const REGION: string = process.env.REGION!
const CLIENTID: string = process.env.IS_OFFLINE ? '536w7cg4r4xv0r77siqfxzizub' : process.env.COGNITO_USER_POOL_CLIENT_ID!
const AUTHFLOW: AuthFlowType = 'USER_PASSWORD_AUTH'

const client = process.env.IS_OFFLINE
  ? new CognitoIdentityProviderClient({ region: REGION, endpoint: 'http://localhost:5000' })
  : new CognitoIdentityProviderClient({ region: REGION })

export const signup = async (req: Request) => {
  try {
    const { name, email, password, role, ...rest } = req.body

    const params: SignUpCommandInput = {
      ClientId: CLIENTID,
      Username: name,
      Password: password,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
        {
          Name: 'custom:role',
          Value: role,
          // Value: convertToCommaSeparatedString(role),
        },
      ],
    }
    console.log(params)
    const result: SignUpCommandOutput = await client.send(new SignUpCommand(params))
    console.log(result)
    return {
      statusCode: 200,
      body: JSON.stringify('User has been signed up!'),
    }
  } catch (err) {
    console.error(err)
    return {
      statusCode: 400,
      body: JSON.stringify(err.message),
    }
  }
}

export const confirmSignUp = async (req: Request) => {
  try {
    const { name, confirmationCode, ...rest } = req.body

    const params: ConfirmSignUpCommandInput = {
      ClientId: CLIENTID,
      Username: name,
      ConfirmationCode: confirmationCode,
    }
    console.log(params)
    const result: ConfirmSignUpCommandOutput = await client.send(new ConfirmSignUpCommand(params))
    console.log(result)
    return {
      statusCode: 200,
      body: JSON.stringify('User has been activate!'),
    }
  } catch (err) {
    console.error(err)
    return {
      statusCode: 400,
      body: JSON.stringify(err.message),
    }
  }
}

export const signin = async (req: Request) => {
  try {
    const { name, password, ...rest } = req.body

    const params: InitiateAuthCommandInput = {
      ClientId: CLIENTID,
      AuthFlow: AUTHFLOW,
      AuthParameters: {
        USERNAME: name,
        PASSWORD: password,
      },
    }
    console.log(params)
    const result: InitiateAuthCommandOutput = await client.send(new InitiateAuthCommand(params))
    console.log(result)
    return {
      statusCode: 200,
      body: JSON.stringify(result.AuthenticationResult),
    }
  } catch (err) {
    console.error(err)
    return {
      statusCode: 400,
      body: JSON.stringify(err.message),
    }
  }
}

/*
 * ユーティリティ関数群.
 */
// オブジェクトをカンマ区切りの文字列に変換する
function convertToCommaSeparatedString(obj: { [key: string]: boolean }): string {
  const trueKeys = Object.keys(obj).filter((key) => obj[key])
  return trueKeys.join(', ')
}
