'use strict'
import Link from 'next/link'
import { Card } from 'react-bootstrap'

// local type definition.
type PropsType = {
  src: any
  styles: any
  alt?: string
  title?: string
  explanation?: string
  history?: string
}

const MyCard = ({
  src,
  styles,
  alt,
  title,
  explanation,
  history,
}: PropsType) => {
  // tsx.
  return (
    <Card className={styles.card}>
      <Card.Img src={src} alt={alt} />
      <Card.ImgOverlay>
        {title !== undefined && <Card.Title>{title}</Card.Title>}
        {explanation !== undefined && <Card.Text>{explanation}</Card.Text>}
        {history !== undefined && <Card.Text>{history}</Card.Text>}
      </Card.ImgOverlay>
    </Card>
  )
}

export default MyCard
