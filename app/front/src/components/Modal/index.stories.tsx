import type { Meta, StoryObj } from '@storybook/react'
import _Modal from './index'

const meta: Meta<typeof _Modal> = {
  component: _Modal,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof _Modal>

export const Primary: Story = {
  args: {
    show: true,
    title: '確認',
    body: 'ログアウトしますか？',
    messageOK: 'はい',
    messageColse: 'いいえ',
    handleOK: () => {
      console.log('handleOK')
    },
    handleClose: () => {
      console.log('handleClose')
    },
  },
}
