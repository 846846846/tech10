'use strict'
import { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { GoodsAPI } from '../../webapi/entity/goods'
import { MetaAPI } from '../../webapi/entity/meta'
import NavBar from '@/components/NavBar'
import MyCard from '@/components/Card'
import MyPagination from '@/components/Pagination'
import Breadcrumbs, { BreadcrumbItem } from '@/components/Breadcrumb'
import { Row, Col, Carousel } from 'react-bootstrap'
import styles from '../../styles/Buyer.module.scss'

// local type definition.
type ListItems = Pick<Goods, 'id' | 'name' | 'price' | 'owner' | 'image'>

// constant declaration.
const DUMMY_IMAGE = 'https://placehold.jp/150x150.png'
const ITEMS_PER_PAGE = 10
const PANIGATION_MAX_DISP = 5
const ITEMS_PER_ROW = 3

/**
 *
 * @returns
 */
const GoodsList: NextPage = () => {
  // hooks.
  const [data, setData] = useState<Array<ListItems>>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [index, setIndex] = useState(0)

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

  // handler.
  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex)
  }

  // display.
  const title = '商品一覧'
  const totalItems = data.length
  const totalPages = Math.ceil(totalItems / ITEMS_PER_ROW)
  const currentItems = data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const breadcrumbItems: BreadcrumbItem[] = [
    { text: 'トップ', href: '/' },
    { text: '商品一覧' },
  ]

  // tsx.
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <main className={styles.main}>
        <NavBar styles={styles.navBar} />
        <Breadcrumbs items={breadcrumbItems} />
        <Carousel interval={null} indicators={false} variant="dark">
          {Array.from({ length: totalPages }).map((_, i) => (
            <Carousel.Item key={i}>
              <Row className={`${styles.row}`}>
                {Array.from({ length: ITEMS_PER_ROW }).map((_, j) => {
                  const { id, name, price, owner, image } = {
                    ...currentItems[i * ITEMS_PER_ROW + j],
                  }
                  return (
                    <Col key={j}>
                      {id ? (
                        <MyCard
                          src={image}
                          styles={styles}
                          id={id}
                          title={name}
                          explanation={price + '円'}
                        />
                      ) : (
                        <></>
                      )}
                    </Col>
                  )
                })}
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
        <div className={styles.pagination}>
          <MyPagination
            items={data}
            itemsPerPage={ITEMS_PER_PAGE}
            paginationMaxDisp={PANIGATION_MAX_DISP}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </main>
    </>
  )
}

export default GoodsList
