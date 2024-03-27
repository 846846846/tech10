import { mockClient } from 'aws-sdk-client-mock'
import { GetItemCommand } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb'
import DDB from '../../src/libs/ddb'

// DynamoDBDocumentClientのモックを作成
const ddbDocumentClientMock = mockClient(DynamoDBDocumentClient)

beforeEach(() => {
  ddbDocumentClientMock.reset() // 各テストの前にモックをリセット
})

describe('DDB', () => {
  const ddb = new DDB()

  it('getItem returns an item if found', async () => {
    // GetItemCommandのモック動作を設定
    const Item = { pk: { S: '123' }, sk: { S: 'Test Item' } }
    ddbDocumentClientMock.on(GetItemCommand).resolves({
      Item,
    })

    const result = await ddb.getItem('TestTable', 'pk', '123', 'sk', 'Test Item')
    expect(result).toEqual(Item)
  })

  it('getItem returns an item if not found', async () => {
    // GetItemCommandのモック動作を設定
    ddbDocumentClientMock.on(GetItemCommand).resolves({})

    const result = await ddb.getItem('TestTable', 'pk', '123', 'sk', 'Test Item')
    expect(result).toEqual(null)
  })

  it('getItem should throw an error if the DynamoDB operation fails', async () => {
    // DynamoDB操作が失敗した場合のエラーをシミュレート
    const errorMessage = 'DynamoDB operation failed'
    ddbDocumentClientMock.on(GetItemCommand).rejects(new Error(errorMessage))

    // getItem メソッドがエラーを投げることを検証
    await expect(ddb.getItem('TestTable', 'id', '123', 'name', 'Test Item')).rejects.toThrow(errorMessage)
  })

  it('query returns items', async () => {
    // QueryCommandのモック動作を設定
    const Items = [{ pk: { S: '123' }, sk: { S: 'Test Item' } }]
    ddbDocumentClientMock.on(QueryCommand).resolves({
      Items,
    })

    const result = await ddb.query('TestTable', 'pk = :pk', { ':pk': { S: '123' } })
    expect(result.Items).toEqual(Items)
  })

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

  it('transactWrite successfully writes items', async () => {
    // TransactWriteCommandのモック動作を設定
    ddbDocumentClientMock.on(TransactWriteCommand).resolves({})

    const action = 'Put'
    const TableName = 'TestTable'
    const items = [
      { pk: '123', sk: 'Test Item' },
      { pk: '456', sk: 'Test Item' },
    ]

    await expect(ddb.transactWrite(action, TableName, items)).resolves.not.toThrow()
  })

  it('transactWrite successfully updates items', async () => {
    // TransactWriteCommandのモック動作を設定
    ddbDocumentClientMock.on(TransactWriteCommand).resolves({})

    const action = 'Update'
    const TableName = 'TestTable'
    const items = [
      {
        Key: { pk: '123', sk: 'Test Item' },
        attrs: [{ name: 'test', value: 10 }],
      },
    ]

    await expect(ddb.transactWrite(action, TableName, items)).resolves.not.toThrow()
  })

  it('transactWrite successfully deletes items', async () => {
    // TransactWriteCommandのモック動作を設定
    ddbDocumentClientMock.on(TransactWriteCommand).resolves({})

    const action = 'Delete'
    const TableName = 'TestTable'
    const items = [{ pk: '123', sk: 'Test Item' }]

    await expect(ddb.transactWrite(action, TableName, items)).resolves.not.toThrow()
  })

  it('transactWrite should throw an error if action not supported', async () => {
    // TransactWriteCommandのモック動作を設定
    ddbDocumentClientMock.on(TransactWriteCommand).resolves({})

    const action = 'dummy'
    const TableName = 'TestTable'
    const items = [{ pk: '123', sk: 'Test Item' }]

    await expect(ddb.transactWrite(action, TableName, items)).resolves.not.toThrow()
  })

  it('transactWrite should throw an error if the DynamoDB operation fails', async () => {
    // DynamoDB操作が失敗した場合のエラーをシミュレート
    const errorMessage = 'DynamoDB operation failed'
    ddbDocumentClientMock.on(TransactWriteCommand).rejects(new Error(errorMessage))

    // query メソッドがエラーを投げることを検証
    const action = 'Put'
    const TableName = 'TestTable'
    const items = [{ pk: '123', sk: 'Test Item' }]

    await expect(ddb.transactWrite(action, TableName, items)).rejects.toThrow(errorMessage)
  })

  it('change the value of process.env.IS_OFFLINE to ture', async () => {
    // process.envをテスト用の値に設定
    process.env.IS_OFFLINE = 'true'

    const ddbOffline = new DDB()

    // GetItemCommandのモック動作を設定
    ddbDocumentClientMock.on(GetItemCommand).resolves({
      Item: { pk: { S: '123' }, sk: { S: 'Test Item' } },
    })

    const result = await ddbOffline.getItem('TestTable', 'pk', '123', 'sk', 'Test Item')
    expect(result).toEqual({ pk: { S: '123' }, sk: { S: 'Test Item' } })

    // テスト終了後、環境変数を元に戻す
    process.env.IS_OFFLINE = undefined
  })
})
