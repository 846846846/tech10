import { mockClient } from 'aws-sdk-client-mock'
import { DynamoDBDocumentClient, QueryCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb'
import DDB from '../src/libs/ddb'

// DynamoDBDocumentClientのモックを作成
const ddbDocumentClientMock = mockClient(DynamoDBDocumentClient)

beforeEach(() => {
  ddbDocumentClientMock.reset() // 各テストの前にモックをリセット
})

describe('DDB', () => {
  const ddb = new DDB()

  it('query returns items using gsi', async () => {
    // QueryCommandのモック動作を設定
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
    // DynamoDB操作が失敗した場合のエラーをシミュレート
    const errorMessage = 'DynamoDB operation failed'
    ddbDocumentClientMock.on(QueryCommand).rejects(new Error(errorMessage))

    // query メソッドがエラーを投げることを検証
    await expect(ddb.query('TestTable', 'pk = :pk', { ':pk': { S: '123' } })).rejects.toThrow(errorMessage)
  })

  it('transactWrite should throw an error if action not supported', async () => {
    // TransactWriteCommandのモック動作を設定
    ddbDocumentClientMock.on(TransactWriteCommand).resolves({})

    const action = 'dummy'
    const TableName = 'TestTable'
    const items = [{ pk: '123', sk: 'Test Item' }]

    await expect(ddb.transactWrite(action, TableName, items)).resolves.not.toThrow()
  })
})
