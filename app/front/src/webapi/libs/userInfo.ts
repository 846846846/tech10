import * as jwt from 'jsonwebtoken'

export default class UserInfoLib {
  constructor() {}

  private decodToken = (authorization: string | undefined) => {
    try {
      if (authorization === undefined)
        throw new Error('500:authorization is undefined.')

      // トークンのデコード
      const token = jwt.decode(authorization) as jwt.JwtPayload
      console.log(token)
      return token
    } catch (err) {
      throw err
    }
  }

  public getOwner(authorization: string | undefined) {
    try {
      return this.decodToken(authorization)['cognito:username']
    } catch (err) {
      throw err
    }
  }

  public getRole(authorization: string | undefined) {
    try {
      return this.decodToken(authorization)['custom:role']
    } catch (err) {
      throw err
    }
  }

  public getEmail(authorization: string | undefined) {
    try {
      return this.decodToken(authorization)['email']
    } catch (err) {
      throw err
    }
  }
}
