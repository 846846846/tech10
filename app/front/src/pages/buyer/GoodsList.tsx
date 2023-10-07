'use strict'
import { NextPage } from 'next'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Button, Pagination } from 'react-bootstrap'
import { GoodsAPI } from '../../webapi/entity/goods'
import { MetaAPI } from '../../webapi/entity/meta'
import GlobalNav from '../../components/buyer/GlobalNav'
import styles from '../../styles/Buyer.module.scss'

// local type definition.
type ListItems = Pick<Goods, 'id' | 'name' | 'price' | 'owner' | 'image'>

// constant declaration.
const ITEMS_PER_PAGE = 10
const DUMMY_IMAGE = 'https://placehold.jp/150x150.png'

/**
 *
 * @returns
 */
const GoodsList: NextPage = () => {
  // hooks.
  const [data, setData] = useState<Array<ListItems>>([])
  const [currentPage, setCurrentPage] = useState(1)

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

  // pagination.
  const totalItems = data.length
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
  const currentItems = data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )
  let startPage: number, endPage: number
  if (currentPage <= 3) {
    startPage = 1
    endPage = 5
  } else if (currentPage > totalPages - 2) {
    startPage = totalPages - 4
    endPage = totalPages
  } else {
    startPage = currentPage - 2
    endPage = currentPage + 2
  }
  const pages = [...Array(endPage + 1 - startPage).keys()].map(
    (i) => startPage + i
  )

  // tsx.
  return (
    <Container className={styles.container}>
      <GlobalNav />
      <div className={styles.goodsList}>
        {Array.from({ length: Math.ceil(currentItems.length / 2) }).map(
          (_, rowIndex) => (
            <Row className="mb-4" key={rowIndex}>
              <Col md={6}>
                <Card>
                  <Card.Img
                    variant="top"
                    className={styles.image}
                    src={currentItems[rowIndex * 2].image}
                  />
                  <Card.Body>
                    <Card.Text>
                      <Link
                        href={`/buyer/GoodsView?Id=${
                          currentItems[rowIndex * 2].id
                        }`}
                      >
                        {currentItems[rowIndex * 2].name}
                      </Link>
                    </Card.Text>
                    <Card.Text>{currentItems[rowIndex * 2].price}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              {currentItems[rowIndex * 2 + 1] && (
                <Col md={6}>
                  <Card>
                    <Card.Img
                      variant="top"
                      className={styles.image}
                      src={currentItems[rowIndex * 2 + 1].image}
                    />
                    <Card.Body>
                      <Card.Text>
                        <Link
                          href={`/buyer/GoodsView?Id=${
                            currentItems[rowIndex * 2 + 1].id
                          }`}
                        >
                          {currentItems[rowIndex * 2 + 1].name}
                        </Link>
                      </Card.Text>
                      <Card.Text>
                        {currentItems[rowIndex * 2 + 1].price}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              )}
            </Row>
          )
        )}
        <Pagination>
          <Pagination.First
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          />
          <Pagination.Prev
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          />

          {pages.map((page) => (
            <Pagination.Item
              key={page}
              active={page === currentPage}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Pagination.Item>
          ))}

          <Pagination.Next
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
          />
          <Pagination.Last
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          />
        </Pagination>

        {/* <Pagination className={styles.pagination}>
          {[...Array(totalPages)].map((_, idx) => (
            <Pagination.Item
              key={idx}
              active={idx === currentPage - 1}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </Pagination.Item>
          ))}
        </Pagination> */}
        {/* {Array.from({
          length: Math.min(10, Math.ceil(data.length / 2)),
        }).map((_, rowIndex) => (
          <Row className="mb-4" key={rowIndex}>
            {data.slice(rowIndex * 2, rowIndex * 2 + 2).map((item) => (
              <Col key={item.id} md={6}>
                <Card>
                  <Card.Img
                    variant="top"
                    src={item.image}
                    className={styles.image}
                  />
                  <Card.Body>
                    <Card.Title>
                      <Link href={`/buyer/GoodsView?Id=${item.id}`}>
                        {item.name}
                      </Link>
                    </Card.Title>
                    <Card.Text>{item.price}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ))} */}
      </div>
    </Container>
  )
}

export default GoodsList
