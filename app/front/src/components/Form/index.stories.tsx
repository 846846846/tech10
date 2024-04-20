import type { Meta, StoryObj } from '@storybook/react'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import _Form, { FormItem } from './index'

const meta: Meta<typeof _Form> = {
  component: _Form,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof _Form>

const FormWithHooks = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Products>()
  const formRef = useRef<HTMLFormElement>(null)

  const formItems: Array<FormItem> = [
    {
      id: 'name',
      type: 'text',
      title: '商品名',
      explanation:
        '商品の名称。顧客（購入者）が商品を検索や認識するための名前。',
      options: {
        required: { value: true, message: '入力必須のパラメータです。' },
        pattern: {
          value: /^.{0,30}$/,
          message: '30文字以内で入力してください。',
        },
      },
    },
    {
      id: 'explanation',
      type: 'textarea',
      title: '商品説明',
      explanation: '商品の詳細な情報や特徴を説明するテキスト。',
      options: {
        pattern: {
          value: /^.{0,1000}$/,
          message: '1000文字以内で入力してください。',
        },
      },
    },
    {
      id: 'price',
      type: 'number',
      title: '商品価格',
      explanation: '商品の販売価格。',
      options: {
        required: { value: true, message: '入力必須のパラメータです。' },
        pattern: {
          value: /^[1-9][0-9]{0,9}$/,
          message: '10桁以内の数値で入力してください(0は不可です)。',
        },
      },
    },
    {
      id: 'image',
      type: 'file',
      title: '商品画像',
      explanation: '商品の実際の見た目を示す写真やイラスト。',
      options: {
        required: { value: true, message: '入力必須のパラメータです。' },
      },
    },
    {
      id: 'category',
      type: 'text',
      title: 'カテゴリ',
      explanation: '商品の分類。例：「家電」「ファッション」「食品」など。',
    },
  ]

  return (
    <_Form
      formItems={formItems}
      formRef={formRef}
      errors={errors}
      register={register}
      // extraComponent={extraComponent}
    />
  )
}

export const Primary: Story = {
  render: () => <FormWithHooks />,
}
