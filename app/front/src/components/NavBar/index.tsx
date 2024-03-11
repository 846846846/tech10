import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Nav, Navbar, Container, Badge } from 'react-bootstrap'
import { BoxArrowRight, Cart3 } from 'react-bootstrap-icons'
import styles from './index.module.scss'
import EntityAPI from '../../libs/webapi/entity'
import JWTWrap from '../../utils/jwt'
import Modal from '@/components/Modal'

interface NavVarProps {
  itemNum?: number
}

const _NavBar: React.FC<NavVarProps> = ({ itemNum = 0 }) => {
  // hooks.
  const [owner, setOwner] = useState<string>('')
  const [showModalLogout, setShowModalLogout] = useState<boolean>(false)
  const [showModalCart, setShowModalCart] = useState<boolean>(false)

  const router = useRouter()

  useEffect(() => {
    try {
      const orgToken = localStorage.getItem('jwtToken')
      if (orgToken !== null) {
        const jwtToken = new JWTWrap(JSON.parse(orgToken).IdToken)
        const owner = jwtToken.getOwner()
        setOwner(owner)
      } else {
        console.error('jwtToken is not found !!')
      }
    } catch (err) {
      console.error(err)
    }
  }, [])

  // handler.
  const handleOrderFix = async () => {
    const cart = localStorage.getItem('cart')
    console.log(cart)
    // const res = await new EntityAPI('orders').create(cart)
    // console.log(res.status)
  }

  // tsx.
  return (
    <Navbar bg="dark" data-bs-theme="dark" fixed="top">
      <Modal
        show={showModalLogout}
        title="確認"
        body="ログアウトしますか？"
        messageOK="はい"
        messageColse="いいえ"
        handleOK={() => {
          router.push('/')
        }}
        handleClose={() => {
          setShowModalLogout(false)
        }}
      />
      <Modal
        show={showModalCart}
        title="カート"
        body="注文しますか？"
        messageOK="はい"
        messageColse="いいえ"
        handleOK={handleOrderFix}
        handleClose={() => {
          setShowModalCart(false)
        }}
      />
      <Container fluid>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#OpeA">操作A</Nav.Link>
            <Nav.Link href="#OpeB">操作B</Nav.Link>
            <Nav.Link href="#OpeC">操作C</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Cart3
          size="48px"
          color="white"
          cursor="pointer"
          onClick={() => {
            setShowModalCart(true)
          }}
        />
        <Badge>{itemNum}</Badge>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            ログイン中: <span>{owner} </span>
            <Navbar.Brand>
              <BoxArrowRight
                onClick={() => {
                  setShowModalLogout(true)
                }}
                size="24px"
                color="white"
                cursor="pointer"
              />
            </Navbar.Brand>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default _NavBar
