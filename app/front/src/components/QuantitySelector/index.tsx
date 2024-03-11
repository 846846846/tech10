import React from 'react'
import { Container, Form, InputGroup, Button } from 'react-bootstrap'
import styles from './index.module.scss'

interface QuantitySelectorProps {
  quantity: number
  onQuantityChange: (newQuantity: number) => void
  label?: string
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onQuantityChange,
  label,
}) => {
  const handleIncrement = () => onQuantityChange(quantity + 1)
  const handleDecrement = () => onQuantityChange(Math.max(quantity - 1, 1))
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10)
    if (!isNaN(newValue) && newValue >= 1) {
      onQuantityChange(newValue)
    }
  }

  return (
    <Container className={styles.container}>
      {label && <Form.Label className={styles.label}>{label}</Form.Label>}
      <InputGroup>
        <Button variant="outline-secondary" onClick={handleDecrement}>
          -
        </Button>
        <Form.Control
          type="number"
          value={quantity}
          onChange={handleChange}
          min="1"
          className="text-center"
        />
        <Button variant="outline-secondary" onClick={handleIncrement}>
          +
        </Button>
      </InputGroup>
    </Container>
  )
}

export default QuantitySelector
