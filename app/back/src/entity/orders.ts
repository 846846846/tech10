import { Request, Response } from 'express'
import Base from './base'
import DDB from '../libs/ddb'
import JWTWrap from '../utlis/jwt'
import CustomError from '../utlis/customError'

export default class Orders extends Base {
  prefixPK: string = 'o#'
  contentType = { 'content-type': 'applicaion/json' }

  ddb = new DDB()

  constructor() {
    super('order', process.env.TABLE_NAME!, process.env.GSI_LIST_FROM_ENTITY!)
  }

  create = async (req: Request, res: Response) => {
    try {
      const pk = this.addPrefix(this.generateUUID(), this.prefixPK)
      const customer = new JWTWrap(req.headers['authorization']).getOwner()
      const createAt = this.getCurrentTime()

      const products = req.body.map((item) => {
        const { productId, price, quantity } = item
        if (productId === undefined || price === undefined || quantity === undefined) throw new CustomError(400, '必須パラメータが不足しています')
        return {
          pk,
          sk: this.addPrefix(productId, 'p#'),
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
          sk: this.addPrefix(customer, 'c#'),
          entityType: 'order2customer',
        },
        ...products,
      ]
      console.dir(items, { depth: null })

      await this.ddb.transactWrite('Put', this.table, items)

      res.status(201).set(this.contentType).send({ id: pk })
    } catch (err) {
      const code = err instanceof CustomError ? err.code : 500
      res.status(code).set(this.contentType).send({ message: err.message })

      throw err
    }
  }

  read = async (req: Request, res: Response) => {
    try {
      let result: any = undefined
      const id = req.url.replace('/', '') as string
      if (id) {
        const data = await this.ddb.query(
          this.table,
          '#pk = :v1',
          { ':v1': this.addPrefix(id, this.prefixPK) },
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
          customerId: this.removePrefix(csk, 'c#'),
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

        if (!data.Count || data.Items === undefined) throw new CustomError(404, '商品情報が見つかりません')

        result = data.Items.map(({ pk, createAt, updateAt }) => ({
          id: this.removePrefix(pk, this.prefixPK),
          createAt,
          updateAt,
        }))
      }

      res.status(200).set(this.contentType).send(result)
    } catch (err) {
      const code = err instanceof CustomError ? err.code : 500
      res.status(code).set(this.contentType).send({ message: err.message })

      throw err
    }
  }

  update = async (req: Request, res: Response) => {
    try {
      const id = this.addPrefix(req.url.replace('/', '') as string, this.prefixPK)
      const updateAt = this.getCurrentTime()

      const items: Record<string, any>[] = req.body.map((item) => {
        const { productId, price, quantity } = item
        if (productId === undefined || price === undefined || quantity === undefined) throw new CustomError(400, '必須パラメータが不足しています')
        return {
          Key: { pk: id, sk: this.addPrefix(productId, 'p#') },
          attrs: [
            { name: 'price', value: price },
            { name: 'quantity', value: quantity },
            { name: 'updateAt', value: updateAt },
          ],
        }
      })
      console.dir(items, { depth: null })

      await this.ddb.transactWrite('Update', this.table, items)

      res.status(204).set(this.contentType).send({ id })
    } catch (err) {
      const code = err instanceof CustomError ? err.code : 500
      res.status(code).set(this.contentType).send({ message: err.message })

      throw err
    }
  }

  delete = async (req: Request, res: Response) => {
    try {
      const id = this.addPrefix(req.url.replace('/', '') as string, this.prefixPK)

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

      res.status(204).set(this.contentType).send({ id })
    } catch (err) {
      const code = err instanceof CustomError ? err.code : 500
      res.status(code).set(this.contentType).send({ message: err.message })

      throw err
    }
  }
}
