import { Request, Response } from 'express'
import {
  CognitoIdentityProviderClient,
  AuthFlowType,
  SignUpCommand,
  SignUpCommandInput,
  // SignUpCommandOutput,
  ConfirmSignUpCommand,
  ConfirmSignUpCommandInput,
  // ConfirmSignUpCommandOutput,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
  InitiateAuthCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider'
import Base from './base'

export default class Users extends Base {
  REGION: string = process.env.REGION!
  CLIENTID: string = process.env.COGNITO_USER_POOL_CLIENT_ID!
  AUTHFLOW: AuthFlowType = 'USER_PASSWORD_AUTH'

  client = process.env.IS_OFFLINE
    ? new CognitoIdentityProviderClient({ region: this.REGION, endpoint: 'http://localhost:5000' })
    : // ? new CognitoIdentityProviderClient({ region: REGION, endpoint: 'http://moto:5000' })  // docker用.
      new CognitoIdentityProviderClient({ region: this.REGION })

  constructor() {
    super('user', { 'content-type': 'applicaion/json' })
  }

  reqToOperation(req: Request) {
    const operationMap = {
      signup: 'signup',
      confirmSignup: 'confirmSignup',
      signin: 'signin',
    }
    const parts = req.url.split('/')
    const operation = parts[parts.length - 1]
    return operationMap[operation] || undefined
  }

  // @ts-ignore
  private signup = async (req: Request, res: Response) => {
    try {
      const { name, email, password, role } = req.body

      const params: SignUpCommandInput = {
        ClientId: this.CLIENTID,
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
          },
        ],
      }
      // console.log(params)
      await this.client.send(new SignUpCommand(params))
      res.status(200).set(this.contentType).send({ message: 'User has been signed up!' })
    } catch (err) {
      throw err
    }
  }

  // @ts-ignore
  private confirmSignup = async (req: Request, res: Response) => {
    try {
      const { name, confirmationCode } = req.body

      const params: ConfirmSignUpCommandInput = {
        ClientId: this.CLIENTID,
        Username: name,
        ConfirmationCode: confirmationCode,
      }
      console.log(params)
      await this.client.send(new ConfirmSignUpCommand(params))
      res.status(200).set(this.contentType).send({ message: 'User has been activate!' })
    } catch (err) {
      throw err
    }
  }

  // @ts-ignore
  private signin = async (req: Request, res: Response) => {
    try {
      const { name, password } = req.body

      const params: InitiateAuthCommandInput = {
        ClientId: this.CLIENTID,
        AuthFlow: this.AUTHFLOW,
        AuthParameters: {
          USERNAME: name,
          PASSWORD: password,
        },
      }
      console.log(params)
      const result: InitiateAuthCommandOutput = await this.client.send(new InitiateAuthCommand(params))
      res.status(200).set(this.contentType).send(result.AuthenticationResult)
    } catch (err) {
      throw err
    }
  }
}
