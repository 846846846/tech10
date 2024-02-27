'use strict'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import {
  Nav,
  Navbar,
  Container,
  Form,
  Row,
  Col,
  Button,
  Badge,
} from 'react-bootstrap'
import { BoxArrowRight, Cart3 } from 'react-bootstrap-icons'
import UserInfoLib from '../webapi/libs/userInfo'
import WebAPI from '../webapi/entity/entity'
import MyModal from '@/components/Modal'

// local type definition.
type PropsType = {
  styles: any
  itemNum?: number
}

const MyNavVar = ({ styles, itemNum = 0 }: PropsType) => {
  // hooks.
  const [owner, setOwner] = useState<string>('')
  const [showModal, setShowModal] = useState<boolean>(false)

  const router = useRouter()

  useEffect(() => {
    try {
      const jwtToken = localStorage.getItem('jwtToken')
      if (jwtToken !== null) {
        const userInfoLib = new UserInfoLib()
        const owner = userInfoLib.getOwner(JSON.parse(jwtToken).IdToken)
        setOwner(owner)
      } else {
        console.error('jwtToken is not found !!')
      }
    } catch (err) {
      console.error(err)
    }
  }, [])

  // tsx.
  return (
    <Navbar bg="dark" data-bs-theme="dark" fixed="top">
      <MyModal
        show={showModal}
        title="確認"
        body="ログアウトしますか？"
        messageOK="はい"
        messageColse="いいえ"
        handleOK={() => {
          router.push('/')
        }}
        handleClose={() => {
          setShowModal(false)
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
        {/* <Form>
          <Row>
            <Col xs="auto">
              <Form.Control
                type="text"
                placeholder="Search"
                className=" mr-sm-2"
              />
            </Col>
            <Col xs="auto">
              <Button
                onClick={() => {
                  alert('TBD')
                }}
              >
                Submit
              </Button>
            </Col>
          </Row>
        </Form> */}
        <Cart3
          size="48px"
          color="white"
          cursor="pointer"
          onClick={async () => {
            alert('TBD')
            const res = await new WebAPI('orders').create({})
          }}
        />
        <Badge>{itemNum}</Badge>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            ログイン中: <span>{owner} </span>
            <Navbar.Brand>
              <BoxArrowRight
                onClick={() => {
                  setShowModal(true)
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

export default MyNavVar
