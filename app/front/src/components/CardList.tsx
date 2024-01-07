'use strict'
import Link from 'next/link'
import { Row, Col, Card } from 'react-bootstrap'

// local type definition.
export type CardItemType = {
  id: string
  image: any
  title: string
  text: string[]
}

type PropsType = {
  items: CardItemType[]
  itemsPerRow: number
  styles: any
}

const CardList = ({ items, itemsPerRow, styles }: PropsType) => {
  // tsx.
  return (
    <>
      {Array.from({ length: Math.ceil(items.length / itemsPerRow) }).map(
        (_, i) => (
          <Row md={2} className={`${styles.cardRow}`} key={i}>
            {Array.from({ length: itemsPerRow }).map((_, j) => {
              const { id, image, title, text } = {
                ...items[j + i * itemsPerRow],
              }
              return (
                <Col className={styles.cardCol} key={j}>
                  {id !== undefined && (
                    <Card className={styles.card}>
                      <Link href={'/buyer/GoodsView?id=' + id}>
                        <Card.Img src={image} alt={title} />
                      </Link>
                      <Card.Body>
                        {title !== undefined && (
                          <Card.Title>{title}</Card.Title>
                        )}
                        {Array.from({ length: text?.length }).map((_, j) => (
                          <Card.Text key={j}>{text[j]}</Card.Text>
                        ))}
                      </Card.Body>
                    </Card>
                  )}
                </Col>
              )
            })}
          </Row>
        )
      )}
    </>
  )
}

export default CardList
