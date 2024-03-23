import type { Meta, StoryObj } from '@storybook/react'
import Breadcrumbs from './index'

const meta: Meta<typeof Breadcrumbs> = {
  component: Breadcrumbs,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Breadcrumbs>

export const Primary: Story = {
  args: {
    items: [
      { text: 'トップ', href: '/' },
      { text: '商品一覧', href: '/customer/ProductsList' },
      { text: 'カート' },
    ],
  },
}
