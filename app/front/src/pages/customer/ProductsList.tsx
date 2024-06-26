import { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import styles from './Customer.module.scss'
import EntityAPI from '../../libs/webapi/entity'
import MetaAPI from '../../libs/webapi/meta'
import LocalStorageLib from '../../libs/storage/localStorage'
import NavBar from '@/components/NavBar'
import CardList, { CardItemType } from '@/components/CardList'
import Pagination from '@/components/Pagination'
import Breadcrumbs, { BreadcrumbItem } from '@/components/Breadcrumb'

type ListItems = Pick<Products, 'id' | 'name' | 'price' | 'image'>

const ITEMS_PER_ROW = 2
const ITEMS_PER_PAGE = 10
const PANIGATION_MAX_DISP = 5

/**
 *
 * @returns
 */
const ProductsList: NextPage = () => {
  // hooks.
  const [data, setData] = useState<Array<ListItems>>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [cart, setCart] = useState<Orders[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1.商品情報の一覧を取得する.
        const res = await new EntityAPI('products').readList()

        // 2.画像情報が格納されたS3のPresginedURLを取得する.
        const metaApi = new MetaAPI()
        const res2 = await Promise.all(
          res.data.map(async (item: ListItems) => {
            return {
              id: item.id,
              image: await metaApi
                .generatePresignedUrl(
                  {
                    name: item.image[0],
                  },
                  false
                )
                .then((result) => result.data.url),
            }
          })
        )

        // 3.imageを差し替える.
        const workMap: Map<string, string> = new Map(
          res2.map((item: any) => [item.id, item.image])
        )
        const res3 = res.data.map((item: ListItems) => {
          if (workMap.has(item.id)) {
            return { ...item, image: workMap.get(item.id)! }
          }
        })

        // 4.取得したデータでStateを更新しレンダリングする.
        setData(res3)
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const storedCart = new LocalStorageLib().getCart()
    if (storedCart) setCart(storedCart)
  }, [])

  // display.
  const title = '商品一覧'
  const currentItems = data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const breadcrumbItems: BreadcrumbItem[] = [
    { text: 'トップ', href: '/' },
    { text: '商品一覧' },
  ]

  const cardList: CardItemType[] = currentItems.map((item, i) => ({
    id: item.id,
    image: item.image,
    title: item.name,
    text: [item.price + '円'],
  }))

  // tsx.
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <main className={styles.main}>
        <NavBar itemNum={cart.length} arg={setCart} />
        <Breadcrumbs items={breadcrumbItems} />
        <Container className={styles.container}>
          <CardList items={cardList} itemsPerRow={ITEMS_PER_ROW} />
          <Pagination
            items={data}
            itemsPerPage={ITEMS_PER_PAGE}
            paginationMaxDisp={PANIGATION_MAX_DISP}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </Container>
      </main>
    </>
  )
}

export default ProductsList
