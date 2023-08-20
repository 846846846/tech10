'use strict'
import { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { List, Plus } from 'react-bootstrap-icons'
import Edit from './Edit'
import styles from '../styles/memo.module.scss'

const GlobalNav = () => {
  // hooks.
  const [show, setShow] = useState(false)

  // handler.
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const handleMenu = () => window.alert('未実装...')

  return (
    <>
      <Container fluid className={styles.globalNav}>
        <Row>
          <Col className={styles.menu} onClick={handleMenu}>
            <List size={24} />
          </Col>
          <Col className={styles.title}>メモ一覧</Col>
          <Col className={styles.add}>
            <Plus size={24} onClick={handleShow} />
          </Col>
        </Row>
      </Container>
      <Edit
        type="create"
        show={show}
        handleClose={handleClose}
        memo={{ id: '', title: '', mainText: '', updateAt: '' }}
      />
    </>
  )
}

export default GlobalNav
