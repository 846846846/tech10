import * as jwt from 'jsonwebtoken'

export default class JWTWrap {
  private decodedToken: jwt.JwtPayload

  constructor(IdToken: string | undefined) {
    try {
      if (IdToken === undefined) throw new Error('IdToken is undefined.')

      this.decodedToken = jwt.decode(IdToken) as jwt.JwtPayload
    } catch (err) {
      throw err
    }
  }

  public getOwner() {
    return this.decodedToken['cognito:username']
  }

  public getRole() {
    return this.decodedToken['custom:role']
  }

  public getEmail() {
    return this.decodedToken['email']
  }
}
