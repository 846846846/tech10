import * as jwt from 'jsonwebtoken'

export default class JWTWrap {
  private decodedToken: jwt.JwtPayload

  constructor(authorization: string | undefined) {
    try {
      if (authorization === undefined) throw new Error('authorization is undefined.')

      // Beaerを取り除く.
      const idToken = authorization.split(' ')[1]
      if (idToken === undefined) throw new Error('500:idToken is undefined.')

      this.decodedToken = jwt.decode(idToken) as jwt.JwtPayload
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
