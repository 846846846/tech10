import { Request, Response } from 'express'
import Base from './base'
import DDB from '../libs/ddb'
import UserInfoLib from '../libs/userInfo'

class ConsideredError extends Error {
  constructor(message: string, public code: number) {
    super(message)
    this.name = 'ConsideredError'
    Object.setPrototypeOf(this, ConsideredError.prototype)
  }
}

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
      const customer = new UserInfoLib().getOwner(req.headers['authorization'])
      const createAt = this.getCurrentTime()
      const { productId, price, quantity } = req.body

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
        {
          pk,
          sk: this.addPrefix(productId, 'p#'),
          entityType: 'order2product',
          price,
          quantity,
        },
      ]

      await this.ddb.transactWrite('Put', this.table, items)

      res.status(201).set(this.contentType).send({ id: pk })
    } catch (err) {
      if (err instanceof ConsideredError) {
        res.status(err.code).set(this.contentType).send(err.message)
      } else {
        res.status(500).set(this.contentType).send({ err })
      }
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
        // console.dir(data, { depth: null })

        if (!data.Count || data.Items === undefined) throw new ConsideredError('指定された情報は存在しません', 404)

        const { createAt, updateAt } = data.Items.filter((i) => i.entityType === 'order')[0]
        const { sk: psk, price, quantity } = data.Items.filter((i) => i.entityType === 'order2product')[0]
        const { sk: csk } = data.Items.filter((i) => i.entityType === 'order2customer')[0]

        result = {
          productId: this.removePrefix(psk, 'p#'),
          price,
          quantity,
          createAt,
          updateAt,
          customerId: this.removePrefix(csk, 'c#'),
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
        // console.dir(data, { depth: null })

        if (!data.Count || data.Items === undefined) throw new ConsideredError('商品情報が見つかりません', 404)

        result = data.Items.map(({ pk, createAt, updateAt }) => ({
          id: this.removePrefix(pk, this.prefixPK),
          createAt,
          updateAt,
        }))
      }

      res.status(200).set(this.contentType).send(result)
    } catch (err) {
      if (err instanceof ConsideredError) {
        res.status(err.code).set(this.contentType).send(err.message)
      } else {
        res.status(500).set(this.contentType).send({ err })
      }
      throw err
    }
  }

  update = async (req: Request, res: Response) => {
    try {
      const id = this.addPrefix(req.url.replace('/', '') as string, this.prefixPK)
      const { productId, price, quantity } = req.body
      const updateAt = this.getCurrentTime()

      const items: Record<string, any>[] = [
        {
          Key: { pk: id, sk: this.addPrefix(productId, 'p#') },
          attrs: [
            { name: 'price', value: price },
            { name: 'quantity', value: quantity },
            { name: 'updateAt', value: updateAt },
          ],
        },
      ]
      console.dir(items, { depth: null })

      await this.ddb.transactWrite('Update', this.table, items)

      res.status(204).set(this.contentType).send({ id })
    } catch (err) {
      if (err instanceof ConsideredError) {
        res.status(err.code).set(this.contentType).send(err.message)
      } else {
        res.status(500).set(this.contentType).send({ err })
      }
      throw err
    }
  }

  delete = async (req: Request, res: Response) => {
    try {
      const id = this.addPrefix(req.url.replace('/', '') as string, this.prefixPK)

      const data = await this.ddb.query(
        this.table,
        '#pk = :v1',
        { ':v1': this.addPrefix(id, this.prefixPK) },
        {
          '#pk': 'pk',
        }
      )
      // console.dir(data, { depth: null })

      if (!data.Count || data.Items === undefined) throw new ConsideredError('指定された情報は存在しません', 404)

      const productId = this.addPrefix(data.Items.filter((i) => i.entityType === 'order2product')[0].sk, 'p#')
      const customerId = this.addPrefix(data.Items.filter((i) => i.entityType === 'order2customer')[0].sk, 'c#')

      const items: Record<string, any>[] = [{ Key: { pk: id, sk: id } }, { Key: { pk: id, sk: customerId } }, { Key: { pk: id, sk: productId } }]

      await this.ddb.transactWrite('Delete', this.table, items)

      res.status(204).set(this.contentType).send({ id })
    } catch (err) {
      if (err instanceof ConsideredError) {
        res.status(err.code).set(this.contentType).send(err.message)
      } else {
        res.status(500).set(this.contentType).send({ err })
      }
      throw err
    }
  }
}
