import Link from 'next/link'
import { Row, Col, Card } from 'react-bootstrap'
import styles from './index.module.scss'

export interface CardItemType {
  id: string
  image: any
  title: string
  text: string[]
}

interface CardListProps {
  items: CardItemType[]
  itemsPerRow: number
}

const CardList: React.FC<CardListProps> = ({ items, itemsPerRow }) => {
  // tsx.
  return (
    <>
      {Array.from({ length: Math.ceil(items.length / itemsPerRow) }).map(
        (_, i) => (
          <Row md={2} key={i}>
            {Array.from({ length: itemsPerRow }).map((_, j) => {
              const { id, image, title, text } = {
                ...items[j + i * itemsPerRow],
              }
              return (
                <Col className={styles.col} key={j}>
                  {id !== undefined && (
                    <Card>
                      <Link href={'/customer/ProductsView?id=' + id}>
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
