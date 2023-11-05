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
const CLIENTID: string = process.env.IS_OFFLINE ? 'm8pey4tjguxgfbnygik4s3mm02' : process.env.COGNITO_USER_POOL_CLIENT_ID!
const AUTHFLOW: AuthFlowType = 'USER_PASSWORD_AUTH'

const client = process.env.IS_OFFLINE
  ? new CognitoIdentityProviderClient({ region: REGION, endpoint: 'http://localhost:5000' })
  : new CognitoIdentityProviderClient({ region: REGION })

export const signup = async (req: Request) => {
  try {
    const { email, password, ...rest } = req.body

    const params: SignUpCommandInput = {
      ClientId: CLIENTID,
      Username: email,
      Password: password,
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
    const { email, confirmationCode, ...rest } = req.body

    const params: ConfirmSignUpCommandInput = {
      ClientId: CLIENTID,
      Username: email,
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
    const { email, password, ...rest } = req.body

    const params: InitiateAuthCommandInput = {
      ClientId: CLIENTID,
      AuthFlow: AUTHFLOW,
      AuthParameters: {
        USERNAME: email,
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
