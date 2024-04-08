import * as jwt from 'jsonwebtoken'
import CustomError from './customError'
export default class JWTWrap {
  private decodedToken: jwt.JwtPayload

  constructor(authorization: string | undefined) {
    try {
      console.log(11)
      if (authorization === undefined) throw new CustomError(400, 'authorizationヘッダが見つかりません')
      console.log(12)

      // Beaerを取り除く.
      const idToken = authorization.split(' ')[1]
      if (idToken === undefined) throw new CustomError(400, 'idTokenが見つかりません')

      this.decodedToken = jwt.decode(idToken) as jwt.JwtPayload
      console.log(13)
    } catch (err) {
      console.log(14)
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
