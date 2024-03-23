import type { Meta, StoryObj } from '@storybook/react'
import _Pagination from './index'

const meta: Meta<typeof _Pagination> = {
  component: _Pagination,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof _Pagination>

export const Primary: Story = {
  args: {
    items: [],
    itemsPerPage: 5,
    paginationMaxDisp: 3,
    currentPage: 1,
    setCurrentPage: undefined,
  },
}
