import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import QuantitySelector from './index'

const meta: Meta<typeof QuantitySelector> = {
  component: QuantitySelector,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof QuantitySelector>

const QuantitySelectorWithHooks = () => {
  const [quantity, setQuantity] = useState<number>(1)

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity)
  }

  return (
    <QuantitySelector
      quantity={quantity}
      onQuantityChange={handleQuantityChange}
      label="個数"
    />
  )
}

export const Primary: Story = {
  render: () => <QuantitySelectorWithHooks />,
}
