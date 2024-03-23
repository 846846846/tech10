import type { Meta, StoryObj } from '@storybook/react'
import CardList from './index'

const meta: Meta<typeof CardList> = {
  component: CardList,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CardList>

const IMAGE_SIZE = '200x300.png'

export const Primary: Story = {
  args: {
    items: [
      {
        id: '0001',
        image: 'https://placehold.jp/' + IMAGE_SIZE,
        title: 'title1',
        text: ['12345678901234567890'],
      },
      {
        id: '0002',
        image: 'https://placehold.jp/' + IMAGE_SIZE,
        title: 'title2',
        text: ['12345678901234567890'],
      },
      {
        id: '0003',
        image: 'https://placehold.jp/' + IMAGE_SIZE,
        title: 'title3',
        text: ['12345678901234567890'],
      },
      {
        id: '0004',
        image: 'https://placehold.jp/' + IMAGE_SIZE,
        title: 'title4',
        text: ['12345678901234567890'],
      },
      {
        id: '0005',
        image: 'https://placehold.jp/' + IMAGE_SIZE,
        title: 'title5',
        text: ['12345678901234567890'],
      },
    ],
    itemsPerRow: 2,
  },
}
