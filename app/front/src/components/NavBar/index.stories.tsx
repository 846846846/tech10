import type { Meta, StoryObj } from '@storybook/react'
import _NavBar from './index'

const meta: Meta<typeof _NavBar> = {
  component: _NavBar,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof _NavBar>

export const Primary: Story = {
  args: {},
}
