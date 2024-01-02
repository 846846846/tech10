'use strict'
import Link from 'next/link'
import { Card } from 'react-bootstrap'

// local type definition.
type PropsType = {
  src: any
  styles: any
  alt?: string
  id?: string
  title?: string
  explanation?: string
  history?: string
}

const MyCard = ({
  src,
  styles,
  alt,
  id,
  title,
  explanation,
  history,
}: PropsType) => {
  // tsx.
  return (
    <Card className={styles.card}>
      <Card.Img src={src} alt={alt} />
      <Card.Body>
        <Link href={'/buyer/GoodsView?id=' + id}>テスト</Link>
        {title !== undefined && <Card.Title>{title}</Card.Title>}
        {explanation !== undefined && <Card.Text>{explanation}</Card.Text>}
        {history !== undefined && <Card.Text>{history}</Card.Text>}
      </Card.Body>
    </Card>
  )
}

export default MyCard
