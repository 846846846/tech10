'use strict'
import { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { GoodsAPI } from '../../webapi/entity/goods'
import { MetaAPI } from '../../webapi/entity/meta'
import NavBar from '@/components/NavBar'
import CardList from '@/components/CardList'
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

  // display.
  const title = '商品一覧'

  // tsx.
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <main className={styles.main}>
        <NavBar styles={styles.navBar} />
        <CardList data={data} />
      </main>
    </>
  )
}

export default GoodsList
