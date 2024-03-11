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
import styles from './Customer.module.scss'
import EntityAPI from '../../libs/webapi/entity'
import MetaAPI from '../../libs/webapi/meta'
import NavBar from '@/components/NavBar'
import Breadcrumbs, { BreadcrumbItem } from '@/components/Breadcrumb'
import QuantitySelector from '@/components/QuantitySelector'

/**
 *
 * @returns
 */
const ProductsView: NextPage = () => {
  // hooks.
  const [product, setProduct] = useState<Products>()
  const [cart, setCart] = useState<Orders[]>([])
  const [quantity, setQuantity] = useState<number>(1)

  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    const fetchData = async () => {
      try {
        // コンポーネントの初期レンダリング時にはundefinedとなるためガードする.
        if (id !== undefined) {
          // 1. 商品情報の詳細を取得する.
          const res = await new EntityAPI('products').readDetail(id as string)

          // 2. 画像情報が格納されたS3のPresginedURLを取得する.
          const url = await new MetaAPI().generatePresignedUrl(
            {
              name: res.data.image[0],
            },
            false
          )

          // 3. stateにセットする.
          res.data.image[0] = url
          setProduct(res.data)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [id])

  useEffect(() => {
    const storedCart = localStorage.getItem('cart')
    if (storedCart) {
      setCart(JSON.parse(storedCart))
    }
  }, [])

  // handler.
  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity)
  }

  const handleAddtoCart = () => {
    if (product) {
      const { id: productId, name: productName, price } = product
      const newCart = [
        ...cart,
        {
          productId,
          productName,
          price,
          quantity,
        },
      ]
      setCart(() => newCart)
      localStorage.setItem('cart', JSON.stringify(newCart))
    } else {
      console.log('商品情報が未取得')
    }
  }

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
        <title>{product?.name}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <main className={styles.main}>
        <NavBar itemNum={cart.length} />
        <Breadcrumbs items={breadcrumbItems} />
        <Container className={styles.container}>
          <Row className={styles.rowView}>
            <Carousel interval={null} indicators={false} variant="dark">
              {/* [TODO] サブ画像対応 */}
              {Array.from({ length: 2 }).map((_, i) => (
                <Carousel.Item key={i}>
                  <div className={styles.carouselItem2}>
                    <Image
                      src={product?.image[0].data.url}
                      alt={product?.name}
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
                    <td id={styles.tableData}>{product?.name}</td>
                  </tr>
                  <tr>
                    <td id={styles.tableData}>値段</td>
                    <td id={styles.tableData}>{product?.price + '円'}</td>
                  </tr>
                  <tr>
                    <td id={styles.tableData}>説明</td>
                    <td id={styles.tableData}>{product?.explanation}</td>
                  </tr>
                  <tr>
                    <td id={styles.tableData}>販売者</td>
                    <td id={styles.tableData}>{product?.owner}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
          <Row>
            <Col>
              <QuantitySelector
                quantity={quantity}
                onQuantityChange={handleQuantityChange}
                label="個数"
              />
            </Col>
            <Col>
              <Button variant="outline-secondary" onClick={handleAddtoCart}>
                カートに入れる
              </Button>
            </Col>
          </Row>
        </Container>
      </main>
    </>
  )
}

export default ProductsView
