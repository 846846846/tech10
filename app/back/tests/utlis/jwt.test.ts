import JWTWrap from '../../src/utlis/jwt'
import * as jwt from 'jsonwebtoken'

// jwt.decodeをモック化
jest.mock('jsonwebtoken', () => ({
  ...jest.requireActual('jsonwebtoken'),
  decode: jest.fn(),
}))

describe('JWTWrap', () => {
  const mockDecode = jwt.decode as jest.Mock // モック化した関数の型を指定

  beforeEach(() => {
    // モックの設定を各テストの前にクリア
    mockDecode.mockClear()
  })

  it('should decode token and get username', () => {
    mockDecode.mockReturnValue({
      'cognito:username': 'test_user',
    })

    const jwtWrap = new JWTWrap('Bearer token')
    expect(jwtWrap.getOwner()).toBe('test_user')
  })

  it('should decode token and get role', () => {
    mockDecode.mockReturnValue({
      'custom:role': 'admin',
    })

    const jwtWrap = new JWTWrap('Bearer token')
    expect(jwtWrap.getRole()).toBe('admin')
  })

  it('should decode token and get email', () => {
    mockDecode.mockReturnValue({
      email: 'test@example.com',
    })

    const jwtWrap = new JWTWrap('Bearer token')
    expect(jwtWrap.getEmail()).toBe('test@example.com')
  })

  it('should throw error if authorization is undefined', () => {
    try {
      new JWTWrap(undefined)
    } catch (err) {
      expect(err.code).toBe(400)
      expect(err.message).toBe('authorizationヘッダが見つかりません')
    }
  })

  it('should throw error if idToken is undefined', () => {
    try {
      new JWTWrap('Bearer')
    } catch (err) {
      expect(err.code).toBe(400)
      expect(err.message).toBe('idTokenが見つかりません')
    }
  })
})
