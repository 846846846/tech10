'use strict'
import Link from 'next/link'
import { useState } from 'react'
import { Row, Col, Card, Pagination } from 'react-bootstrap'
import styles from '../../styles/Buyer.module.scss'

// local type definition.
type ListItems = Pick<Goods, 'id' | 'name' | 'price' | 'owner' | 'image'>
type MyProps = { data: Array<ListItems> }

// constant declaration.
const ITEMS_PER_PAGE = 10
const PANIGATION_MAX_DISP = 5

const CardList = ({ data }: MyProps) => {
  // hooks.
  const [currentPage, setCurrentPage] = useState(1)

  // local variable.
  const totalItems = data.length
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
  const currentItems = data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )
  let startPage: number, endPage: number
  if (currentPage <= 3) {
    startPage = 1
    endPage = Math.min(PANIGATION_MAX_DISP, totalPages)
  } else if (currentPage > totalPages - 2) {
    startPage = Math.max(1, totalPages - 4)
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
    <div className={styles.goodsList}>
      {Array.from({ length: Math.ceil(currentItems.length / 2) }).map(
        (_, rowIndex) => (
          <Row className="mb-4" key={rowIndex}>
            <Col xs={6}>
              <Card>
                <Card.Img
                  variant="top"
                  className={styles.cardImage}
                  src={currentItems[rowIndex * 2].image}
                />
                <Card.Body className={styles.cardBody}>
                  <Card.Text>
                    <Link
                      href={`/buyer/GoodsView?Id=${
                        currentItems[rowIndex * 2].id
                      }`}
                    >
                      {currentItems[rowIndex * 2].name}
                    </Link>
                  </Card.Text>
                  <Card.Text>{currentItems[rowIndex * 2].price}円</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            {currentItems[rowIndex * 2 + 1] ? (
              <Col xs={6}>
                <Card>
                  <Card.Img
                    variant="top"
                    className={styles.cardImage}
                    src={currentItems[rowIndex * 2 + 1].image}
                  />
                  <Card.Body className={styles.cardBody}>
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
                      {currentItems[rowIndex * 2 + 1].price}円
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ) : (
              <div className={styles.cardBody}></div>
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
    </div>
  )
}

export default CardList
