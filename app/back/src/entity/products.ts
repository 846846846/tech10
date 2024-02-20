import { Request } from 'express'
import Base from './base'
import DDB from '../libs/ddb2'
import UserInfoLib from '../libs/userInfo'

export default class Products extends Base {
  prefixPK: string = 'p#'
  prefixSK: string = 'ow#'

  ddb = new DDB()

  constructor() {
    super('product', process.env.TABLE_NAME!, process.env.GSI_LIST_FROM_ENTITY!)
  }

  create = async (req: Request) => {
    try {
      const pk = this.addPrefix(this.generateUUID(), this.prefixPK)
      const sk = this.addPrefix(new UserInfoLib().getOwner(req.headers['authorization']), this.prefixSK)
      const createAt = this.getCurrentTime()
      const { name, price, image, explanation, category } = req.body

      const items: any = [
        {
          pk,
          sk: pk,
          entityType: 'product',
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

      return JSON.stringify(pk)
    } catch (err) {
      throw err
    }
  }

  read = async (req: Request) => {
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
        if (!data.Count || data.Items === undefined) throw new Error('404:specified data not found.')

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
        console.dir(data, { depth: null })
        if (!data.Count || data.Items === undefined) throw new Error('404:specified data not found.')
        result = data.Items.map(({ price, updateAt, pk, detail, createAt }) => ({
          id: this.removePrefix(pk, this.prefixPK),
          price,
          name: detail.name,
          image: detail.image,
          explanation: detail.explanation,
          category: detail.category,
          createAt,
          updateAt,
        }))
      }

      console.log(result)
      return JSON.stringify(result)
    } catch (err) {
      throw err
    }
  }

  update = async (req: Request) => {
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

      return id
    } catch (err) {
      throw err
    }
  }

  delete = async (req: Request) => {
    try {
      const id = this.addPrefix(req.url.replace('/', '') as string, this.prefixPK)
      const sk = this.addPrefix(new UserInfoLib().getOwner(req.headers['authorization']), this.prefixSK)
      const items: Record<string, any>[] = [
        {
          Key: { pk: id, sk: id },
        },
        { Key: { pk: id, sk } },
      ]

      await this.ddb.transactWrite('Delete', this.table, items)

      return id
    } catch (err) {
      throw err
    }
  }
}
