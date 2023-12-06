import * as jwt from 'jsonwebtoken'

export default class UserInfoLib {
  constructor() {}

  private decodToken = (authorization: string | undefined) => {
    try {
      if (authorization === undefined) throw new Error('500:authorization is undefined.')

      // Beaerを取り除く.
      const idToken = authorization.split(' ')[1]
      if (idToken === undefined) throw new Error('500:idToken is undefined.')

      // トークンのデコード
      const token = jwt.decode(idToken) as jwt.JwtPayload
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
