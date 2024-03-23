import type { Meta, StoryObj } from '@storybook/react'
import SubmitButtons from './index'

const meta: Meta<typeof SubmitButtons> = {
  component: SubmitButtons,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SubmitButtons>

export const Primary: Story = {
  args: {
    handleSubmit: () => {
      console.log('handleSubmit')
    },
    onSubmit: () => {
      console.log('onSubmit')
    },
    onClose: () => {
      console.log('onClose')
    },
  },
}
