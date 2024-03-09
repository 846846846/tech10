'use strict'
import React from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'

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
    <div className="d-flex">
      {label && <Form.Label>{label}</Form.Label>}
      <InputGroup className="mb-3">
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
    </div>
  )
}

export default QuantitySelector
