import { Request, Response } from 'express'
import Base from './base'
import DDB from '../libs/ddb'
import { generateUUID, getCurrentTime, addPrefix, removePrefix } from '../utlis'
import JWTWrap from '../utlis/jwt'
import CustomError from '../utlis/customError'

export default class Products extends Base {
  ddb = new DDB()
  table = process.env.TABLE_NAME!
  gsi1 = process.env.GSI_LIST_FROM_ENTITY!
  prefixPK = 'p#'
  prefixSK = 'ow#'

  constructor() {
    super('product', { 'content-type': 'applicaion/json' })
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
      // [TODO] 商品名称の重複チェック(そもそも必要かも含めて検討)
      const pk = addPrefix(generateUUID(), this.prefixPK)
      const sk = addPrefix(new JWTWrap(req.headers['authorization']).getOwner(), this.prefixSK)
      const createAt = getCurrentTime()
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

        const product = data.Items.filter((i) => i.entityType === 'product')[0]
        const product2owner = data.Items.filter((i) => i.entityType === 'product2owner')[0]
        result = {
          id: removePrefix(product.pk, this.prefixPK),
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
        console.dir(data, { depth: null })
        if (!data.Count || data.Items === undefined) throw new CustomError(404, '指定された情報は存在しません')
        result = data.Items.map(({ price, updateAt, pk, detail, createAt }) => ({
          id: removePrefix(pk, this.prefixPK),
          price,
          name: detail.name,
          image: detail.image,
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

      const { name, price, image, explanation, category } = req.body
      const updateAt = getCurrentTime()

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

      res.status(204).send()
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
        { ':v1': addPrefix(id, this.prefixPK) },
        {
          '#pk': 'pk',
        }
      )
      console.dir(data, { depth: null })
      if (!data.Count || data.Items === undefined) throw new CustomError(404, '指定された情報は存在しません')

      const sk = addPrefix(new JWTWrap(req.headers['authorization']).getOwner(), this.prefixSK)
      const items: Record<string, any>[] = [
        {
          Key: { pk: id, sk: id },
        },
        { Key: { pk: id, sk } },
      ]

      await this.ddb.transactWrite('Delete', this.table, items)

      res.status(204).send()
    } catch (err) {
      throw err
    }
  }
}
