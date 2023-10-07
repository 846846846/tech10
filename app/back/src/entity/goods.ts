import { Request } from 'express'
import * as ddb from '../libs/ddb'
import moment from 'moment'
import 'moment-timezone'
import crypto from 'crypto'

const TABLE_NAME = process.env.TABLE_NAME!
const GSI_GENERAL = process.env.GSI_GENERAL!
const GSI_OWNERGOODSLIST = process.env.GSI_OWNERGOODSLIST!
const MY_ENYITY = 'goods'

export const create = async (req: Request) => {
  try {
    const { id, name, explanation, price, image, category, ...rest } = req.body

    // 1. 登録済みのidはエラーとする
    const registedUuid = await ddb.getUuidByType('id', id, TABLE_NAME, GSI_GENERAL, false)
    console.log(registedUuid)
    if (registedUuid) throw new Error('409:duplicate id.')

    // 2. DBに合う形にデータを整形.
    const uuid: string = crypto.randomUUID()
    const ownerId = 'dummy' // [TODO] チケットECSITE-14で対応予定.
    const jstTime = moment().tz('Asia/Tokyo').format('YYYY-MM-DDTHH:mm:ssZ')

    const typeList = ['entity', 'owner', 'id', 'name', 'explanation', 'price', 'image', 'category', 'createAt', 'updateAt']
    const valueList = [MY_ENYITY, ownerId, id, name, explanation, price, image, category, jstTime, jstTime]
    const items: any = typeList
      .map((type, index) =>
        type === 'id' || type === 'name' || type === 'owner' || type === 'price' || type === 'image'
          ? { uuid: uuid, type: type, value: valueList[index], ownerid: ownerId }
          : {
              uuid: uuid,
              type: type,
              value: valueList[index],
            }
      )
      .filter((item) => item.value !== '') // リクエストボディにないパラメータをフィルタリング([TBD] バリテーション).

    // 3. データを新規作成する
    await ddb.transactWrite('Put', TABLE_NAME, items)

    return JSON.stringify(id)
  } catch (err) {
    throw err
  }
}

export const readAll = async (req: Request) => {
  try {
    const ownerId = req.headers['authorization'] // [TODO] チケットECSITE-14で対応予定.
    if (ownerId === undefined) throw new Error('404:specified data not found.')

    // 1. オーナーが所有するリストを取得.
    const data = await ddb.query(
      TABLE_NAME,
      '#ownerid = :v1',
      {
        ':v1': ownerId,
      },
      {
        '#ownerid': 'ownerid',
      },
      GSI_OWNERGOODSLIST
    )
    if (!data.Count || data.Items === undefined) throw new Error('404:specified data not found.')

    // 2. 仕様に沿った形式に整形して返却
    return JSON.stringify(toResFormatList(data.Items))
  } catch (err) {
    throw err
  }
}

export const readByID = async (req: Request, id: string) => {
  try {
    // 1. idからuuidを特定
    const uuid = await ddb.getUuidByType('id', id, TABLE_NAME, GSI_GENERAL)

    // 2. uuidを元に情報を取得
    const data = await ddb.query(TABLE_NAME, '#uuid = :v1', { ':v1': uuid }, { '#uuid': 'uuid' })
    if (!data.Count || data.Items === undefined) throw new Error('404:specified data not found.')
    // console.dir(data, { depth: null })

    // 3. 仕様に沿った形式に整形して返却
    return JSON.stringify(toResFormatDetail(data.Items))
  } catch (err) {
    throw err
  }
}

export const update = async (req: Request, id: string) => {
  try {
    const { name, explanation, price, image, category, ...rest } = req.body

    // 1. idからuuidを特定
    const uuid = await ddb.getUuidByType('id', id, TABLE_NAME, GSI_GENERAL)

    //2. uuidから対象アイテム群を取得し、valueキーの値を上書きする
    const jstTime = moment().tz('Asia/Tokyo').format('YYYY-MM-DDTHH:mm:ssZ')
    const typeList = ['name', 'explanation', 'price', 'image', 'category', 'updateAt']
    const valueList = [name, explanation, price, image, category, jstTime]

    const items = await ddb
      .query(
        TABLE_NAME,
        '#uuid = :v1',
        {
          ':v1': uuid,
        },
        {
          '#uuid': 'uuid',
        }
      )
      // valueキーの値を上書き.
      .then(function (result) {
        return result.Items?.map((item) => {
          const index = typeList.indexOf(item.type)
          // 更新対象外アイテムのみ上書きする
          if (index !== -1) item.value = valueList[index]
          return item
        })
      })
    if (items === undefined) throw new Error('404:specified items not found.')
    // console.dir(items, { depth: null })

    // 3. 更新実行.
    await ddb.transactWrite('Update', TABLE_NAME, items)

    return JSON.stringify(id)
  } catch (err) {
    throw err
  }
}

export const deleteCus = async (req: Request, id: string) => {
  try {
    // 1. idからuuidを特定
    const uuid = await ddb.getUuidByType('id', id, TABLE_NAME, GSI_GENERAL)

    //2. uuidから対象アイテム群を取得
    const items = await ddb
      .query(
        TABLE_NAME,
        '#uuid = :v1',
        {
          ':v1': uuid,
        },
        {
          '#uuid': 'uuid',
        }
      )
      // valueとownerIdキーは取り除く.
      .then(function (result) {
        return result.Items?.map((item) => {
          delete item.value
          delete item.ownerid
          return item
        })
      })
    if (items === undefined) throw new Error('404:specified items not found.')
    // console.dir(items, { depth: null })

    // 3. 削除実行.
    await ddb.transactWrite('Delete', TABLE_NAME, items)

    return JSON.stringify(id)
  } catch (err) {
    throw err
  }
}

/*
 * ユーティリティ関数群.
 */
// 仕様に沿った形式に整形する
type JSONType = Record<string, any>
const toResFormatDetail = (items: ddb.DDBItemType[]) => {
  const res = items.reduce<JSONType>((acc, cur) => {
    const type = cur.type as unknown as string
    acc[type] = cur.value
    return acc
  }, {})
  return res
}

const toResFormatList = (items: ddb.DDBItemType[]) => {
  const work = items.reduce<JSONType>((acc, cur) => {
    const already = acc.find((i) => i.uuid === cur.uuid)
    const type = cur.type as unknown as string
    if (already) {
      already[type] = cur.value
    } else {
      acc.push({ uuid: cur.uuid, [type]: cur.value })
    }
    return acc
  }, [])

  const res = work.map((i) => {
    delete i.uuid
    return i
  })
  return res
}
