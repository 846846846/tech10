import { Request, Response } from 'express'
import Base from './base'
import DDB from '../libs/ddb'
import JWTWrap from '../utlis/jwt'

class ConsideredError extends Error {
  constructor(message: string, public code: number) {
    super(message)
    this.name = 'ConsideredError'
    Object.setPrototypeOf(this, ConsideredError.prototype)
  }
}

export default class Products extends Base {
  prefixPK: string = 'p#'
  prefixSK: string = 'ow#'
  contentType = { 'content-type': 'applicaion/json' }

  ddb = new DDB()

  constructor() {
    super('product', process.env.TABLE_NAME!, process.env.GSI_LIST_FROM_ENTITY!)
  }

  create = async (req: Request, res: Response) => {
    try {
      // [TODO] 商品名称の重複チェック(そもそも必要かも含めて検討)
      const pk = this.addPrefix(this.generateUUID(), this.prefixPK)
      const sk = this.addPrefix(new JWTWrap(req.headers['authorization']).getOwner(), this.prefixSK)
      const createAt = this.getCurrentTime()
      const { name, price, image, explanation, category } = req.body

      const items: any = [
        {
          pk,
          sk: pk,
          entityType: this.entity,
          detail: {
            name,
            explanation,
            image,
            category,
          },
          price,
          createAt,
          updateAt: createAt,
        },
        {
          pk,
          sk: sk,
          entityType: 'product2owner',
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
        if (!data.Count || data.Items === undefined) throw new ConsideredError('指定された商品情報は存在しません', 404)

        const product = data.Items.filter((i) => i.entityType === 'product')[0]
        const product2owner = data.Items.filter((i) => i.entityType === 'product2owner')[0]
        result = {
          id: this.removePrefix(product.pk, this.prefixPK),
          name: product.detail.name,
          price: product.price,
          image: product.detail.image,
          explanation: product.detail.explanation,
          category: product.detail.category,
          createAt: product.createAt,
          updateAt: product.updateAt,
          owner: product2owner.sk,
        }
      } else {
        const data = await this.ddb.query(
          this.table,
          '#entityType = :v1',
          {
            ':v1': 'product',
          },
          {
            '#entityType': 'entityType',
          },
          this.gsi1
        )
        // console.dir(data, { depth: null })
        if (!data.Count || data.Items === undefined) throw new ConsideredError('商品情報が見つかりません', 404)
        result = data.Items.map(({ price, updateAt, pk, detail, createAt }) => ({
          id: this.removePrefix(pk, this.prefixPK),
          price,
          name: detail.name,
          image: detail.image,
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
      const { name, price, image, explanation, category } = req.body
      const updateAt = this.getCurrentTime()

      const items: Record<string, any>[] = [
        {
          Key: { pk: id, sk: id },
          attrs: [
            { name: 'detail', value: { name, explanation, image, category } },
            { name: 'price', value: price },
            { name: 'updateAt', value: updateAt },
          ],
        },
      ]

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
      const sk = this.addPrefix(new JWTWrap(req.headers['authorization']).getOwner(), this.prefixSK)
      const items: Record<string, any>[] = [
        {
          Key: { pk: id, sk: id },
        },
        { Key: { pk: id, sk } },
      ]

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
