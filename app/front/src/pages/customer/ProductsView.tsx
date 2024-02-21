import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import {
  Container,
  Row,
  Col,
  Image,
  Carousel,
  Button,
  Table,
} from 'react-bootstrap'
import { ProductsAPI } from '../../webapi/entity/products'
import { MetaAPI } from '../../webapi/entity/meta'
import MyNavVar from '@/components/NavVar'
import Breadcrumbs, { BreadcrumbItem } from '@/components/Breadcrumb'
import styles from '../../styles/Buyer.module.scss'

/**
 *
 * @returns
 */
const ProductsView: NextPage = () => {
  // hooks.
  const [data, setData] = useState<Products>()
  const [itemNum, setItemNum] = useState<number>(0)

  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    const fetchData = async () => {
      try {
        // コンポーネントの初期レンダリング時にはundefinedとなるためガードする.
        if (id !== undefined) {
          // 1. 商品情報の詳細を取得する.
          const res = await new ProductsAPI().readDetail(id as string)

          // 2. 画像情報が格納されたS3のPresginedURLを取得する.
          const url = await new MetaAPI().generatePresignedUrl(
            {
              name: res.data.image[0],
            },
            false
          )

          // 3. stateにセットする.
          res.data.image[0] = url
          setData(res.data)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [id])

  console.log(data)

  // display.
  const breadcrumbItems: BreadcrumbItem[] = [
    { text: 'トップ', href: '/' },
    { text: '商品一覧', href: '/customer/ProductsList' },
    { text: '商品詳細' },
  ]

  // tsx.
  return (
    <>
      <Head>
        <title>{data?.name}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <main className={styles.main}>
        <MyNavVar styles={styles.navBar} itemNum={itemNum} />
        <Breadcrumbs items={breadcrumbItems} styles={styles} />
        <Container className={styles.container}>
          <Row className={styles.rowView}>
            <Carousel interval={null} indicators={false} variant="dark">
              {/* [TODO] サブ画像対応 */}
              {Array.from({ length: 2 }).map((_, i) => (
                <Carousel.Item key={i}>
                  <div className={styles.carouselItem2}>
                    <Image
                      src={data?.image[0].data.url}
                      alt={data?.name}
                      className={styles.image}
                      rounded
                    />
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
            <hr />
          </Row>
          <Row>
            <Col className={styles.detail}>
              <Table>
                <tbody>
                  <tr>
                    <td id={styles.tableData}>商品名</td>
                    <td id={styles.tableData}>{data?.name}</td>
                  </tr>
                  <tr>
                    <td id={styles.tableData}>値段</td>
                    <td id={styles.tableData}>{data?.price + '円'}</td>
                  </tr>
                  <tr>
                    <td id={styles.tableData}>説明</td>
                    <td id={styles.tableData}>{data?.explanation}</td>
                  </tr>
                  <tr>
                    <td id={styles.tableData}>販売者</td>
                    <td id={styles.tableData}>{data?.owner}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
          <Row className="mb-5">
            <Col>
              <Button
                onClick={() => {
                  setItemNum(itemNum + 1)
                }}
              >
                カートに入れる
              </Button>
            </Col>
            <Col>
              <Button
                onClick={() => {
                  setItemNum(itemNum - 1)
                }}
              >
                カートから削除する
              </Button>
            </Col>
          </Row>
        </Container>
      </main>
    </>
  )
}

export default ProductsView
