import { Request, Response } from 'express'
import Base from './base'
import DDB from '../libs/ddb'
import { generateUUID, getCurrentTime, addPrefix, removePrefix } from '../utlis'
import JWTWrap from '../utlis/jwt'
import CustomError from '../utlis/customError'

export default class Orders extends Base {
  ddb = new DDB()
  table = process.env.TABLE_NAME!
  gsi1 = process.env.GSI_LIST_FROM_ENTITY!
  prefixPK = 'o#'

  constructor() {
    super('order', { 'content-type': 'applicaion/json' })
  }

  reqToOperation(req: Request) {
    const operationMap = {
      POST: 'create',
      GET: 'read',
      PUT: 'update',
      DELETE: 'delete',
    }
    return operationMap[req.method] || undefined
  }

  // @ts-ignore
  private create = async (req: Request, res: Response) => {
    try {
      const pk = addPrefix(generateUUID(), this.prefixPK)
      const customer = new JWTWrap(req.headers['authorization']).getOwner()
      const createAt = getCurrentTime()

      const products = req.body.map((item) => {
        const { productId, price, quantity } = item
        if (productId === undefined || price === undefined || quantity === undefined) throw new CustomError(400, '必須パラメータが不足しています')
        return {
          pk,
          sk: addPrefix(productId, 'p#'),
          entityType: 'order2product',
          price,
          quantity,
        }
      })

      const items: any = [
        {
          pk,
          sk: pk,
          entityType: 'order',
          createAt,
          updateAt: createAt,
        },
        {
          pk,
          sk: addPrefix(customer, 'c#'),
          entityType: 'order2customer',
        },
        ...products,
      ]
      console.dir(items, { depth: null })

      await this.ddb.transactWrite('Put', this.table, items)

      res
        .status(201)
        .set(this.contentType)
        .send({ id: removePrefix(pk, this.prefixPK) })
    } catch (err) {
      throw err
    }
  }

  // @ts-ignore
  private read = async (req: Request, res: Response) => {
    try {
      let result: any = undefined
      const id = req.url.replace('/', '') as string
      if (id) {
        const data = await this.ddb.query(
          this.table,
          '#pk = :v1',
          { ':v1': addPrefix(id, this.prefixPK) },
          {
            '#pk': 'pk',
          }
        )
        console.dir(data, { depth: null })

        if (!data.Count || data.Items === undefined) throw new CustomError(404, '指定された情報は存在しません')

        const { sk: csk } = data.Items.filter((i) => i.entityType === 'order2customer')[0]
        const detail = data.Items.filter((i) => i.entityType === 'order2product')
        const { createAt, updateAt } = data.Items.filter((i) => i.entityType === 'order')[0]

        result = {
          customerId: removePrefix(csk, 'c#'),
          detail,
          date: { createAt, updateAt },
        }
      } else {
        const data = await this.ddb.query(
          this.table,
          '#entityType = :v1',
          {
            ':v1': 'order',
          },
          {
            '#entityType': 'entityType',
          },
          this.gsi1
        )
        console.dir(data, { depth: null })

        if (!data.Count || data.Items === undefined) throw new CustomError(404, '指定された情報は存在しません')

        result = data.Items.map(({ pk, createAt, updateAt }) => ({
          id: removePrefix(pk, this.prefixPK),
          createAt,
          updateAt,
        }))
      }

      res.status(200).set(this.contentType).send(result)
    } catch (err) {
      throw err
    }
  }

  // @ts-ignore
  private update = async (req: Request, res: Response) => {
    try {
      const id = addPrefix(req.url.replace('/', '') as string, this.prefixPK)
      const data = await this.ddb.query(
        this.table,
        '#pk = :v1',
        { ':v1': addPrefix(id, this.prefixPK) },
        {
          '#pk': 'pk',
        }
      )
      console.dir(data, { depth: null })
      if (!data.Count || data.Items === undefined) throw new CustomError(404, '指定された情報は存在しません')

      const updateAt = getCurrentTime()
      const items: Record<string, any>[] = req.body.map((item) => {
        const { productId, price, quantity } = item
        if (productId === undefined || price === undefined || quantity === undefined) throw new CustomError(400, '必須パラメータが不足しています')
        return {
          Key: { pk: id, sk: addPrefix(productId, 'p#') },
          attrs: [
            { name: 'price', value: price },
            { name: 'quantity', value: quantity },
            { name: 'updateAt', value: updateAt },
          ],
        }
      })
      console.dir(items, { depth: null })

      await this.ddb.transactWrite('Update', this.table, items)

      res.status(204).set(this.contentType).send()
    } catch (err) {
      throw err
    }
  }

  // @ts-ignore
  private delete = async (req: Request, res: Response) => {
    try {
      const id = addPrefix(req.url.replace('/', '') as string, this.prefixPK)

      const data = await this.ddb.query(
        this.table,
        '#pk = :v1',
        { ':v1': id },
        {
          '#pk': 'pk',
        }
      )
      console.dir(data, { depth: null })

      if (!data.Count || data.Items === undefined) throw new CustomError(404, '指定された情報は存在しません')

      const productId = data.Items.filter((i) => i.entityType === 'order2product').map((i) => {
        return { Key: { pk: id, sk: i.sk } }
      })
      const customerId = data.Items.filter((i) => i.entityType === 'order2customer')[0].sk

      const items: Record<string, any>[] = [{ Key: { pk: id, sk: id } }, { Key: { pk: id, sk: customerId } }, ...productId]
      console.dir(items, { depth: null })

      await this.ddb.transactWrite('Delete', this.table, items)

      res.status(204).set(this.contentType).send()
    } catch (err) {
      throw err
    }
  }
}
