import {
  DynamoDBClient,
  AttributeValue,
  ScanCommand,
  ScanCommandInput,
  BatchWriteItemCommand,
  BatchWriteItemCommandInput,
  WriteRequest,
} from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'

export type DDBItemType = Record<string, AttributeValue>

const REGION: string = process.env.REGION!
const dynamoDBClient = process.env.IS_OFFLINE
  ? new DynamoDBClient({
      region: REGION,
      endpoint: 'http://localhost:8000',
    })
  : new DynamoDBClient({
      region: REGION,
    })
const ddbDocClient = DynamoDBDocumentClient.from(dynamoDBClient)

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
  const params: QueryCommandInput = {
    TableName: TableName,
    KeyConditionExpression: keyConExp,
    ExpressionAttributeValues: expAttrVals,
    IndexName: indexName,
    ExpressionAttributeNames: expAttrNames,
  }

  try {
    return await ddbDocClient.send(new QueryCommand(params))
  } catch (err) {
    throw err
  }
}

export const batchWriteItems = async (tableName: string, items: DDBItemType[]) => {
  const requestItems: WriteRequest[] = items.map((item) => {
    return { PutRequest: { Item: item } }
  })
  const params: BatchWriteItemCommandInput = {
    RequestItems: {
      [tableName]: requestItems,
    },
  }

  try {
    return await dynamoDBClient.send(new BatchWriteItemCommand(params))
  } catch (err) {
    throw err
  }
}

export const batchDeleteItems = async (tableName: string, primaryKeys: Record<string, any>[]) => {
  const requestItems: WriteRequest[] = primaryKeys.map((item) => {
    return { DeleteRequest: { Key: item } }
  })
  const params: BatchWriteItemCommandInput = {
    RequestItems: {
      [tableName]: requestItems,
    },
  }

  try {
    return await dynamoDBClient.send(new BatchWriteItemCommand(params))
  } catch (err) {
    throw err
  }
}

type JSONType = Record<string, any>
export const toRes = (items: DDBItemType[]) => {
  const res = items.reduce<JSONType>((acc, cur) => {
    const already = acc.find((i) => i.id === cur.id)
    const type = cur.type as unknown as string
    if (already) {
      already[type] = cur.value
    } else {
      acc.push({ id: cur.id, [type]: cur.value })
    }
    return acc
  }, [])
  return res
}
