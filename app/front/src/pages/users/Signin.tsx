'use strict'
import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
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
import UserInfoLib from '../../webapi/libs/userInfo'

// local type definition
type FormItem = {
  id: keyof Pick<Users, 'name' | 'password' | 'passwordConfirm'>
  type: string
  note: string
  children?: Array<FormCheck>
  options?: any
}

type FormCheck = {
  id: any
  type: FormCheckProps['type']
  note: string
}

/**
 *
 * @returns
 */
const Signin: NextPage = () => {
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

  // handler.
  const onSubmit = async (data: Users) => {
    try {
      const usersApi = new UsersAPI()
      const res = await usersApi.signin(data)
      console.log(res)
      console.log(JSON.parse(res.data.body).IdToken)
      localStorage.setItem('jwtToken', res.data.body)

      const userInfoLib = new UserInfoLib()
      const role = userInfoLib.getRole(JSON.parse(res.data.body).IdToken)
      console.log(role)
      if (role === 'buyer') {
        router.push('/buyer/GoodsList')
      } else if (role === 'seller') {
        router.push('/seller/GoodsRegist')
      } else {
        console.error('unknown role')
        // バックエンドのMockサーバーであるmotoには.
        // レスポンスのJWTにカスタム属性情報を含ませる処理がないためロールが判断できない.
        // リクエスト先がローカルホストの場合、遷移先は固定とする.
        // 必要に応じて書き換えること.
        if (usersApi.getReqDest() === 'localhost') {
          router.push('/buyer/GoodsList')
          // router.push('/seller/GoodsRegist')
        }
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error(err?.response)
      } else {
        console.error(err)
      }
    }
  }

  const onClose = () => {
    console.log('call onClose')
    reset()
  }

  // display.
  const title = 'ログイン'
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
                        case 'checkbox':
                          return (
                            <Form.Group
                              controlId="checkboxGroup"
                              className={styles.roleCheckBox}
                            >
                              {children?.map((item2, index2) => {
                                const { id, type, note } = {
                                  ...item2,
                                }
                                return (
                                  <Form.Check
                                    key={index2}
                                    type={type}
                                    label={note}
                                    {...register(id, options)}
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
              <div>
                <Link href="/users/Signup">アカウントを作成</Link>
              </div>
            </Form>
          </Row>
        </Container>
      </main>
    </>
  )
}

export default Signin
