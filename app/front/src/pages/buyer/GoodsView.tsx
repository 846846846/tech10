import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Container, Row, Col, Image, Carousel } from 'react-bootstrap'
import { GoodsAPI } from '../../webapi/entity/goods'
import { MetaAPI } from '../../webapi/entity/meta'
import MyNavVar from '@/components/NavVar'
import Breadcrumbs, { BreadcrumbItem } from '@/components/Breadcrumb'
import styles from '../../styles/Buyer.module.scss'

// constant declaration.
const DUMMY_IMAGE = 'https://placehold.jp/150x150.png'

/**
 *
 * @returns
 */
const GoodsView: NextPage = () => {
  // hooks.
  const [data, setData] = useState<Goods>()

  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    const fetchData = async () => {
      try {
        // コンポーネントの初期レンダリング時にはundefinedとなるためガードする.
        if (id !== undefined) {
          // 1. 商品情報の詳細を取得する.
          const goodsApi = new GoodsAPI()
          const res = await goodsApi.readDetail(id as string)

          // 2. 画像情報が格納されたS3のPresginedURLを取得する.
          const metaApi = new MetaAPI()
          const url =
            res.data.image === 'dummy'
              ? DUMMY_IMAGE
              : await metaApi
                  .generatePresignedUrl(
                    {
                      name: res.data.image,
                    },
                    false
                  )
                  .then((result) => result.data.url)

          // 3. stateにセットする.
          res.data.image = url
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
    { text: '商品一覧', href: '/buyer/GoodsList' },
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
        <MyNavVar styles={styles.navBar} />
        <Breadcrumbs items={breadcrumbItems} styles={styles} />
        <Container className={styles.container}>
          <Row className={styles.rowView}>
            <Carousel interval={null} indicators={false} variant="dark">
              {/* [TODO] サブ画像対応 */}
              {Array.from({ length: 2 }).map((_, i) => (
                <Carousel.Item key={i}>
                  <div className={styles.carouselItem2}>
                    <Image
                      src={data?.image}
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
              <div>商品名：{data?.name}</div>
              <div>値段：{data?.price + '円'}</div>
              <div>説明：{data?.explanation}</div>
              <div>販売者：{data?.owner}</div>
            </Col>
          </Row>
        </Container>
      </main>
    </>
  )
}

export default GoodsView
