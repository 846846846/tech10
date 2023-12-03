'use strict'
import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  FormCheckProps,
} from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { UsersAPI } from '../../webapi/entity/users'
import styles from '../../styles/Users.module.scss'
import { AxiosError } from 'axios'

// local type definition
type FormItem = {
  id: keyof Users
  type: string
  note: string
  children?: Array<FormCheck>
  options?: any
}

type FormCheck = {
  value: string
  type: FormCheckProps['type']
  note: string
}

/**
 *
 * @returns
 */
const Signup: NextPage = () => {
  // hooks.
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<Users>()
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    reset()
  }, [reset])

  const router = useRouter()

  console.log(watch())

  // handler.
  const onSubmit = async (data: Users) => {
    try {
      console.log(data)
      const usersApi = new UsersAPI()
      const res = await usersApi.signup(data)
      console.log(res)
      router.push('/users/confirmSignUp')
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error(err?.response)
      } else {
        console.error(err)
      }
    }
  }

  const onClose = () => {
    router.push('/users/Signin')
    reset()
  }

  // display.
  const title = 'アカウントを作成'
  const formItems: Array<FormItem> = [
    {
      id: 'name',
      type: 'text',
      note: 'ユーザー名',
      options: {
        required: { value: true, message: '入力必須のパラメータです。' },
        pattern: {
          value: /^[a-zA-Z0-9]{1,10}$/,
          message: '半角英数字かつ1文字から10文字で入力してください。',
        },
      },
    },
    {
      id: 'role',
      type: 'check',
      note: 'ロール',
      children: [
        { value: 'seller', type: 'radio', note: '販売者' },
        { value: 'buyer', type: 'radio', note: '購入者' },
      ],
    },
    {
      id: 'email',
      type: 'text',
      note: 'メールアドレス',
      options: {
        required: { value: true, message: '入力必須のパラメータです。' },
        pattern: {
          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          message: 'メールアドレスの形式が間違っています。',
        },
      },
    },
    {
      id: 'password',
      type: 'password',
      note: 'パスワード',
      options: {
        required: { value: true, message: '入力必須のパラメータです。' },
        pattern: {
          value: /^[a-zA-Z0-9]{1,10}$/,
          message: '半角英数字かつ1文字から10文字で入力してください。',
        },
      },
    },
    {
      id: 'passwordConfirm',
      type: 'password',
      note: 'パスワード(再入力)',
      options: {
        required: { value: true, message: '入力必須のパラメータです。' },
        pattern: {
          value: /^[a-zA-Z0-9]{1,10}$/,
          message: '半角英数字かつ1文字から10文字で入力してください。',
        },
        validate: (value: string) =>
          value === watch('password') || 'パスワードが一致しません。',
      },
    },
  ]

  // tsx.
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <main>
        <Container className={styles.container}>
          <Row>
            <Col>{title}</Col>
          </Row>
          <Row>
            <Form ref={formRef} className={styles.form}>
              {formItems.map((item, index) => {
                const { note, type, id, options, children } = { ...item }
                return (
                  <Form.Group className="mb-3" key={index}>
                    {(() => {
                      switch (type) {
                        case 'textarea':
                          return (
                            <Form.Control
                              as={type}
                              placeholder={note}
                              rows={3}
                              isInvalid={errors[id] !== undefined}
                              {...register(id, options)}
                            />
                          )
                        case 'check':
                          return (
                            <Form.Group
                              controlId="checkGroup"
                              className={styles.roleCheckBox}
                            >
                              {children?.map((item2, index2) => {
                                const { value, type, note } = {
                                  ...item2,
                                }
                                return (
                                  <Form.Check
                                    key={index2}
                                    value={value}
                                    type={type}
                                    label={note}
                                    {...register('role', options)}
                                  />
                                )
                              })}
                            </Form.Group>
                          )
                        default:
                          return (
                            <Form.Control
                              type={type}
                              placeholder={note}
                              isInvalid={errors[id] !== undefined}
                              {...register(id, options)}
                            />
                          )
                      }
                    })()}
                    {errors[id] && (
                      <Form.Text className={styles.error}>
                        {errors[id]?.message as string}
                      </Form.Text>
                    )}
                  </Form.Group>
                )
              })}
              <div className={styles.buttonContainer}>
                <Button
                  className={styles.buttonItem}
                  variant="secondary"
                  size="sm"
                  onClick={onClose}
                >
                  キャンセル
                </Button>
                <Button
                  className={styles.buttonItem}
                  variant="primary"
                  size="sm"
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                >
                  OK
                </Button>
              </div>
            </Form>
          </Row>
        </Container>
      </main>
    </>
  )
}

export default Signup
