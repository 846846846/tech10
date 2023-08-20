import crypto from 'crypto'
import { Request } from 'express'
import * as ddb from '../libs/database/ddb'
import moment from 'moment'
import 'moment-timezone'

const TABLE_NAME: string = process.env.TABLE_NAME!
const GSI1: string = process.env.GSI1!

export const create = async (req: Request) => {
  try {
    const { title, mainText, ...rest } = req.body

    const data = await ddb.query(
      TABLE_NAME,
      '#type = :v1 and #value = :v2',
      {
        ':v1': 'title',
        ':v2': title,
      },
      {
        '#type': 'type',
        '#value': 'value',
      },
      GSI1
    )
    if (data.Count) throw new Error('409:duplicate title.')

    const id: string = crypto.randomUUID()
    const jstTime = moment().tz('Asia/Tokyo').format('YYYY-MM-DDTHH:mm:ssZ')
    console.log(jstTime)
    const items: ddb.DDBItemType[] = [
      {
        id: { S: id },
        type: { S: 'title' },
        value: { S: title },
      },
      {
        id: { S: id },
        type: { S: 'mainText' },
        value: { S: mainText },
      },
      {
        id: { S: id },
        type: { S: 'createAt' },
        value: { S: jstTime },
      },
      {
        id: { S: id },
        type: { S: 'updateAt' },
        value: { S: jstTime },
      },
    ]
    ddb.batchWriteItems(TABLE_NAME, items)

    return JSON.stringify(id)
  } catch (err) {
    throw err
  }
}

export const readAll = async (req: Request) => {
  try {
    const data = await ddb.scan(TABLE_NAME)
    if (!data.Count) throw new Error('404:specified data not found.')
    if (data.Items === undefined) throw new Error('404:specified data not found.')
    return JSON.stringify(ddb.toRes(data.Items))
  } catch (err) {
    throw err
  }
}

export const readByID = async (req: Request, id: string) => {
  try {
    const data = await ddb.query(TABLE_NAME, 'id = :v1', { ':v1': id })
    if (!data.Count) throw new Error('404:specified data not found.')
    return JSON.stringify(data.Items)
  } catch (err) {
    throw err
  }
}

export const update = async (req: Request, id: string) => {
  try {
    const { title, mainText, ...rest } = req.body

    const data = await ddb.query(
      TABLE_NAME,
      '#id = :v1',
      {
        ':v1': id,
      },
      {
        '#id': 'id',
      }
    )
    if (!data.Count) throw new Error('404:unregistered id.')

    const jstTime = moment().tz('Asia/Tokyo').format('YYYY-MM-DDTHH:mm:ssZ')
    const items: ddb.DDBItemType[] = [
      {
        id: { S: id },
        type: { S: 'title' },
        value: { S: title },
      },
      {
        id: { S: id },
        type: { S: 'mainText' },
        value: { S: mainText },
      },
      {
        id: { S: id },
        type: { S: 'updateAt' },
        value: { S: jstTime },
      },
    ]
    ddb.batchWriteItems(TABLE_NAME, items)

    return JSON.stringify(id)
  } catch (err) {
    throw err
  }
}

export const deleteMemo = async (req: Request, id: string) => {
  try {
    const { title, mainText, ...rest } = req.body

    const data = await ddb.query(
      TABLE_NAME,
      '#id = :v1',
      {
        ':v1': id,
      },
      {
        '#id': 'id',
      }
    )
    if (!data.Count) throw new Error('404:unregistered id.')
    if (data.Items === undefined) throw new Error('404:specified data not found.')

    const primaryKeys: Record<string, any>[] | undefined = data.Items?.map((item) => {
      return {
        id: {
          S: item.id,
        },
        type: {
          S: item.type,
        },
      }
    })
    ddb.batchDeleteItems(TABLE_NAME, primaryKeys)

    return JSON.stringify(id)
  } catch (err) {
    throw err
  }
}
