'use strict'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { GoodsAPI } from '../../webapi/entity/goods'
import { MetaAPI } from '../../webapi/entity/meta'
import GlobalNav from '../../components/buyer/GlobalNav'
import CardList from '../../components/buyer/CardList'
import styles from '../../styles/Buyer.module.scss'

// local type definition.
type ListItems = Pick<Goods, 'id' | 'name' | 'price' | 'owner' | 'image'>

// constant declaration.
const DUMMY_IMAGE = 'https://placehold.jp/150x150.png'

/**
 *
 * @returns
 */
const GoodsList: NextPage = () => {
  // hooks.
  const [data, setData] = useState<Array<ListItems>>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1.商品情報の一覧を取得する.
        const goodsApi = new GoodsAPI()
        const res = await goodsApi.readList()

        // 2.画像情報が格納されたS3のPresginedURLを取得する.
        const metaApi = new MetaAPI()
        const res2 = await Promise.all(
          res.data.map(async (item: ListItems) => {
            return {
              id: item.id,
              image:
                item.image === 'dummy'
                  ? DUMMY_IMAGE
                  : await metaApi
                      .generatePresignedUrl(
                        {
                          name: item.image,
                        },
                        false
                      )
                      .then((result) => result.data.url),
            }
          })
        )

        // 3.imageを差し替える.
        const workMap: Map<string, string> = new Map(
          res2.map((item) => [item.id, item.image])
        )
        const res3 = res.data.map((item: ListItems) => {
          if (workMap.has(item.id)) {
            return { ...item, image: workMap.get(item.id)! }
          }
        })

        setData(res3)
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [])

  // tsx.
  return (
    <Container className={styles.container}>
      <GlobalNav />
      <CardList data={data} />
    </Container>
  )
}

export default GoodsList
