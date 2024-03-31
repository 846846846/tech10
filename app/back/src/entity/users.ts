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
import CustomError from '../utlis/customError'

export default class Users {
  contentType = { 'content-type': 'applicaion/json' }

  REGION: string = process.env.REGION!
  CLIENTID: string = process.env.COGNITO_USER_POOL_CLIENT_ID!
  AUTHFLOW: AuthFlowType = 'USER_PASSWORD_AUTH'

  client = process.env.IS_OFFLINE
    ? new CognitoIdentityProviderClient({ region: this.REGION, endpoint: 'http://localhost:5000' })
    : // ? new CognitoIdentityProviderClient({ region: REGION, endpoint: 'http://moto:5000' })  // docker用.
      new CognitoIdentityProviderClient({ region: this.REGION })

  exec = async (req: Request, res: Response) => {
    try {
      const parts = req.url.split('/')
      const action = parts[parts.length - 1]
      switch (action) {
        case 'signup':
          return await this.signup(req, res)
        case 'confirmSignUp':
          return await this.confirmSignUp(req, res)
        case 'signin':
          return await this.signin(req, res)
        default:
          throw new CustomError(400, '未サポートのアクションです')
      }
    } catch (err) {
      const code = err instanceof CustomError ? err.code : 500
      res.status(code).set(this.contentType).send({ message: err.message })

      throw err
    }
  }

  signup = async (req: Request, res: Response) => {
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
      res.status(err.$metadata.httpStatusCode).set(this.contentType).send({ message: err.message })

      throw err
    }
  }

  confirmSignUp = async (req: Request, res: Response) => {
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
      res.status(err.$metadata.httpStatusCode).set(this.contentType).send({ message: err.message })

      throw err
    }
  }

  signin = async (req: Request, res: Response) => {
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
      res.status(err.$metadata.httpStatusCode).set(this.contentType).send({ message: err.message })

      throw err
    }
  }
}
