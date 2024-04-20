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
import LocalStorageLib from '../../libs/storage/localStorage'
import NavBar from '@/components/NavBar'
import Breadcrumbs, { BreadcrumbItem } from '@/components/Breadcrumb'

/**
 *
 * @returns
 */
const CartView: NextPage = () => {
  // hooks.
  const [cart, setCart] = useState<Orders[]>([])
  const [totalAmount, setTotalAmount] = useState<number>(0)

  useEffect(() => {
    const storedCart = new LocalStorageLib().getCart()
    if (storedCart) {
      setCart(storedCart)
      const total = storedCart.reduce((accumulator, order) => {
        return accumulator + parseInt(order.price) * order.quantity
      }, 0)
      setTotalAmount(total)
    }
  }, [])

  // handler.
  const handleOrderFix = async () => {
    const ls = new LocalStorageLib()
    const cart = ls.getCart()
    if (cart) {
      // 不要な情報は取り除く.
      const reqBody = cart.map(({ productName, ...rest }) => rest)
      const res = await new EntityAPI('orders').create(reqBody)
      if (res.status === 201) {
        ls.removeCart()
        setCart([])
        setTotalAmount(0)
        alert('注文されました。')
      } else {
        console.error('注文情報の登録に失敗', res.status)
      }
    } else {
      console.error('カート情報がない')
    }
  }

  // display.
  const breadcrumbItems: BreadcrumbItem[] = [
    { text: 'トップ', href: '/' },
    { text: '商品一覧', href: '/customer/ProductsList' },
    { text: 'カート' },
  ]

  // tsx.
  return (
    <>
      <Head>
        <title>カート</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <main className={styles.main}>
        <NavBar itemNum={cart.length} arg={setCart} />
        <Breadcrumbs items={breadcrumbItems} />
        <Container className={styles.container}>
          <Row>
            <Col>
              <Table>
                <thead>
                  <tr>
                    <th>商品ID</th>
                    <th>商品名称</th>
                    <th>値段</th>
                    <th>購入個数</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((order) => (
                    <tr key={order.productId}>
                      <td>{order.productId}</td>
                      <td>{order.productName}</td>
                      <td>{order.price + ' 円'} </td>
                      <td>{order.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
          <Row>
            <Col>合計金額</Col>
            <Col>{totalAmount + '円'}</Col>
          </Row>
          <Row>
            <Col>
              <Button variant="outline-secondary" onClick={handleOrderFix}>
                注文を確定
              </Button>
            </Col>
          </Row>
        </Container>
      </main>
    </>
  )
}

export default CartView
