import { DynamoDBClient, AttributeValue, ScanCommand, ScanCommandInput, TransactWriteItem } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand, QueryCommandInput, TransactWriteCommand, TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'

export type DDBItemType = Record<string, AttributeValue>

const REGION: string = process.env.REGION!
const dynamoDBClient = process.env.IS_OFFLINE
  ? new DynamoDBClient({
      region: REGION,
      // endpoint: 'http://localhost:8000',
      endpoint: 'http://dynamodb-local:8000',
    })
  : new DynamoDBClient({
      region: REGION,
    })
const ddbDocClient = DynamoDBDocumentClient.from(dynamoDBClient)

/*
 * DynamoDB Wrapper API群.
 */
export const scan = async (TableName: string) => {
  const params: ScanCommandInput = {
    TableName: TableName,
  }

  try {
    const results = await ddbDocClient.send(new ScanCommand(params))
    // なぜかマーシャリング（変換）されないので自力で.
    results.Items = results.Items?.map((item) => unmarshall(item))
    return results
  } catch (err) {
    throw err
  }
}

export const query = async (
  TableName: string,
  keyConExp: string,
  expAttrVals: Record<string, any>,
  expAttrNames?: Record<string, any>,
  indexName?: string
) => {
  try {
    const params: QueryCommandInput =
      indexName !== undefined
        ? {
            TableName: TableName,
            KeyConditionExpression: keyConExp,
            ExpressionAttributeValues: expAttrVals,
            ExpressionAttributeNames: expAttrNames,
            IndexName: indexName,
          }
        : {
            TableName: TableName,
            KeyConditionExpression: keyConExp,
            ExpressionAttributeValues: expAttrVals,
            ExpressionAttributeNames: expAttrNames,
          }

    console.dir(params, { depth: null })
    return await ddbDocClient.send(new QueryCommand(params))
  } catch (err) {
    throw err
  }
}

export const transactWrite = async (action: string, tableName: string, items: DDBItemType[]) => {
  function chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const result: T[][] = []
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize))
    }
    return result
  }

  try {
    // TransactWriteItemsが1度に書き込めるアイテム上限数を超える場合は分割.
    const LIMIT_ITEM_NUM_ONE_TRANSACT = 100
    const chunks = chunkArray(items, LIMIT_ITEM_NUM_ONE_TRANSACT)

    for (const chunk of chunks) {
      const requestItems: TransactWriteItem[] = chunk.map((item) => {
        switch (action) {
          case 'Put':
            return {
              [action]: {
                TableName: tableName,
                Item: item,
              },
            }
          case 'Update':
            return {
              [action]: {
                TableName: tableName,
                Key: { uuid: item.uuid, type: item.type },
                UpdateExpression: 'SET #value = :value',
                ExpressionAttributeValues: { ':value': item.value },
                ExpressionAttributeNames: {
                  '#value': 'value',
                },
              },
            }
          case 'Delete':
            return {
              [action]: {
                TableName: tableName,
                Key: item,
              },
            }
          default:
            return {}
        }
      })

      const params: TransactWriteCommandInput = {
        TransactItems: requestItems,
      }
      // console.dir(params, { depth: null })
      await dynamoDBClient.send(new TransactWriteCommand(params))
    }
  } catch (err) {
    throw err
  }
}

/*
 * DynamoDB Wrapper APIを利用した特化API群.
 */
// 指定されたTypeからuuidを特定し返却する.
export const getUuidByType = async (type: string, value: string, tableName: string, gsi: string, errHandling: boolean = true) => {
  try {
    const data = await query(
      tableName,
      '#type = :v1 and #value = :v2',
      {
        ':v1': type,
        ':v2': value,
      },
      {
        '#type': 'type',
        '#value': 'value',
      },
      gsi
    )

    if (!data.Count || data.Items === undefined) {
      if (errHandling) {
        throw new Error('404:unregistered.')
      } else {
        return null
      }
    }
    return data.Items[0].uuid
  } catch (err) {
    throw err
  }
}
