import { DynamoDBClient, TransactWriteItem } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand, QueryCommandInput, TransactWriteCommand, TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb'

export default class DDB {
  private ddbDocClient: DynamoDBDocumentClient

  constructor() {
    this.ddbDocClient = DynamoDBDocumentClient.from(
      process.env.IS_OFFLINE
        ? new DynamoDBClient({
            region: process.env.REGION!,
            endpoint: 'http://localhost:8000',
            // endpoint: 'http://dynamodb-local:8000',  // docker用.
          })
        : new DynamoDBClient({
            region: process.env.REGION!,
          })
    )
  }

  query = async (
    TableName: string,
    KeyConditionExpression: string,
    ExpressionAttributeValues: Record<string, any>,
    ExpressionAttributeNames?: Record<string, any>,
    IndexName?: string
  ) => {
    try {
      const params: QueryCommandInput =
        IndexName !== undefined
          ? {
              TableName,
              KeyConditionExpression: KeyConditionExpression,
              ExpressionAttributeValues,
              ExpressionAttributeNames,
              IndexName,
            }
          : {
              TableName,
              KeyConditionExpression: KeyConditionExpression,
              ExpressionAttributeValues,
              ExpressionAttributeNames,
            }

      console.dir(params, { depth: null })
      return await this.ddbDocClient.send(new QueryCommand(params))
    } catch (err) {
      throw err
    }
  }

  transactWrite = async (action: string, TableName: string, items: Record<string, any>[]) => {
    try {
      // TransactWriteItemsで1度に書き込めるアイテム上限数を超える場合は分割.
      const LIMIT_ITEM_NUM_ONE_TRANSACT = 100
      const chunks = this.chunkArray(items, LIMIT_ITEM_NUM_ONE_TRANSACT)

      for (const chunk of chunks) {
        const TransactItems: TransactWriteItem[] = chunk.map((item) => {
          switch (action) {
            case 'Put':
              return {
                [action]: {
                  TableName,
                  Item: item,
                },
              }
            case 'Update':
              const { Key, attrs } = item
              const { UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = this.generateUpdateCommand(attrs)
              return {
                [action]: {
                  TableName,
                  Key,
                  UpdateExpression,
                  ExpressionAttributeNames,
                  ExpressionAttributeValues,
                  ConditionExpression: 'attribute_exists(#pk) AND attribute_exists(#sk)', // 該当アイテムの存在確認.
                },
              }
            case 'Delete': {
              const { Key } = item
              return {
                [action]: {
                  TableName,
                  Key,
                  ExpressionAttributeNames: {
                    '#pk': 'pk',
                    '#sk': 'sk',
                  },
                  ConditionExpression: 'attribute_exists(#pk) AND attribute_exists(#sk)', // 該当アイテムの存在確認.
                },
              }
            }
            default:
              console.error(`${action}は未サポートのaction`)
              break
          }
          return {}
        })

        const params: TransactWriteCommandInput = {
          TransactItems,
        }
        console.dir(params, { depth: null })
        await this.ddbDocClient.send(new TransactWriteCommand(params))
      }
    } catch (err) {
      throw err
    }
  }

  private chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
    const result: T[][] = []
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize))
    }
    return result
  }

  private generateUpdateCommand(attributes: Record<string, any>[]): any {
    const temp = attributes.map((_, index) => {
      return `#attr${index + 1} = :value${index + 1}`
    })
    const UpdateExpression = `SET ${temp.join(', ')}`

    const ExpressionAttributeNames = attributes
      .map((e, index) => {
        return { [`#attr${index + 1}`]: e.name }
      })
      .reduce((acc, attr) => {
        return { ...acc, ...attr }
      }, {})
    ExpressionAttributeNames['#pk'] = 'pk'
    ExpressionAttributeNames['#sk'] = 'sk'

    const ExpressionAttributeValues = attributes
      .map((e, index) => {
        return { [`:value${index + 1}`]: e.value }
      })
      .reduce((acc, attr) => {
        return { ...acc, ...attr }
      }, {})

    return { UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues }
  }
}
