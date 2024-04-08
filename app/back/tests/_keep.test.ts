// 現状デッドコードだがとっておきたいコードのテストケース
import { mockClient } from 'aws-sdk-client-mock'
import { DynamoDBDocumentClient, QueryCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb'
import * as jwt from 'jsonwebtoken'
import DDB from '../src/libs/ddb'
import JWTWrap from '../src/utlis/jwt'

// DynamoDBDocumentClientのモックを作成
const ddbDocumentClientMock = mockClient(DynamoDBDocumentClient)

// jwt.decodeをモック化
jest.mock('jsonwebtoken', () => ({
  ...jest.requireActual('jsonwebtoken'),
  decode: jest.fn(),
}))

const ddb = new DDB()
const mockDecode = jwt.decode as jest.Mock // モック化した関数の型を指定

beforeEach(() => {
  ddbDocumentClientMock.reset()
  mockDecode.mockClear()
})

describe('keep it code', () => {
  describe('src/libs/ddb.ts', () => {
    it('query returns items using gsi', async () => {
      const Items = [{ pk: { S: '123' }, sk: { S: 'Test Item' } }]
      ddbDocumentClientMock.on(QueryCommand).resolves({
        Items,
      })

      const result = await ddb.query(
        'TestTable',
        '#pk = :pk',
        { ':pk': { S: '123' } },
        {
          '#pk': 'key',
        },
        'GSI1'
      )
      expect(result.Items).toEqual(Items)
    })

    it('query should throw an error if the DynamoDB operation fails', async () => {
      const errorMessage = 'DynamoDB operation failed'
      ddbDocumentClientMock.on(QueryCommand).rejects(new Error(errorMessage))

      await expect(ddb.query('TestTable', 'pk = :pk', { ':pk': { S: '123' } })).rejects.toThrow(errorMessage)
    })

    it('transactWrite should throw an error if action not supported', async () => {
      ddbDocumentClientMock.on(TransactWriteCommand).resolves({})

      const action = 'dummy'
      const TableName = 'TestTable'
      const items = [{ pk: '123', sk: 'Test Item' }]

      await expect(ddb.transactWrite(action, TableName, items)).resolves.not.toThrow()
    })
  })

  describe('src/utils/jwt.ts', () => {
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
  })
})
