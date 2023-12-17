'use strict'
import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { UsersAPI } from '../../webapi/entity/users'
import styles from '../../styles/Users.module.scss'
import { AxiosError } from 'axios'
import UserInfoLib from '../../webapi/libs/userInfo'
import MyForm, { FormItem } from '@/components/Form'
import SubmitButtons from '@/components/SubmitButtons'

// local type definition.
enum AuthFlow {
  signin = 0,
  signup,
  confirm,
}

/**
 *
 * @returns
 */
const UserAuth: NextPage = () => {
  // hooks.
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<Users>()
  const formRef = useRef<HTMLFormElement>(null)

  const router = useRouter()

  const [authFlow, setAuthFlow] = useState<AuthFlow>(AuthFlow.signin)
  const [err, setErr] = useState<string>('')

  useEffect(() => {
    reset()
    setErr('')
  }, [reset, authFlow])

  // handler.
  const onSubmit = async (data: Users) => {
    try {
      console.log(data)
      switch (authFlow) {
        case AuthFlow.signin:
          {
            const usersApi = new UsersAPI()
            const res = await usersApi.signin(data)
            console.log(res)
            localStorage.setItem('jwtToken', JSON.stringify(res.data))

            const userInfoLib = new UserInfoLib()
            const role = userInfoLib.getRole(res.data.IdToken)
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
          }
          break
        case AuthFlow.signup:
          {
            const usersApi = new UsersAPI()
            const res = await usersApi.signup(data)
            console.log(res)
            setAuthFlow(AuthFlow.confirm)
          }
          return
        case AuthFlow.confirm:
          {
            const usersApi = new UsersAPI()
            const res = await usersApi.confirmSignup(data)
            console.log(res)
            setAuthFlow(AuthFlow.signin)
          }
          return
        default:
          console.error('illegal case !!')
          break
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error(err?.response)
        setErr(err?.response?.data)
      } else {
        console.error(err)
      }
    }
  }

  const onClose = () => {
    console.log('call onClose')
    switch (authFlow) {
      case AuthFlow.signin:
        // 何もしない.
        break
      case AuthFlow.signup:
        setAuthFlow(AuthFlow.signin)
        break
      case AuthFlow.confirm:
        setAuthFlow(AuthFlow.signup)
        break
      default:
        console.error('illegal case !!')
        break
    }
  }

  // title.
  const title = () => {
    switch (authFlow) {
      case AuthFlow.signin:
        return 'ログイン'
      case AuthFlow.signup:
        return 'アカウントを作成'
      case AuthFlow.confirm:
        return 'アカウントを有効化'
      default:
        console.error('illegal case !!')
        break
    }
  }

  // formItems.
  const allFormItems: Array<FormItem> = [
    {
      id: 'name',
      type: 'text',
      placeholder: 'ユーザー名',
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
      placeholder: 'ロール',
      children: [
        { value: 'seller', type: 'radio', label: '販売者' },
        { value: 'buyer', type: 'radio', label: '購入者' },
      ],
    },
    {
      id: 'password',
      type: 'password',
      placeholder: 'パスワード',
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
      placeholder: 'パスワード(再入力)',
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
    {
      id: 'email',
      type: 'text',
      placeholder: 'メールアドレス',
      options: {
        required: { value: true, message: '入力必須のパラメータです。' },
        pattern: {
          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          message: 'メールアドレスの形式が間違っています。',
        },
      },
    },
    {
      id: 'confirmationCode',
      type: 'text',
      placeholder: '有効化コード',
      options: {
        required: { value: true, message: '入力必須のパラメータです。' },
      },
    },
  ]

  // authFlowの状態を参照し、表示するフォームアイテムを選別する.
  const formItems = allFormItems.filter((e) => {
    switch (authFlow) {
      case AuthFlow.signin:
        return (
          e.id === 'name' || e.id === 'password' || e.id === 'passwordConfirm'
        )
      case AuthFlow.signup:
        return (
          e.id === 'name' ||
          e.id === 'role' ||
          e.id === 'email' ||
          e.id === 'password' ||
          e.id === 'passwordConfirm'
        )
      case AuthFlow.confirm:
        return e.id === 'name' || e.id === 'confirmationCode'
      default:
        console.error('illegal case !!')
        return false
    }
  })

  // extraComponent.
  const extraComponent = (
    <>
      <SubmitButtons
        styles={styles}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        onClose={onClose}
      />
      {authFlow === AuthFlow.signin ? (
        <div>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault()
              setAuthFlow(AuthFlow.signup)
            }}
          >
            アカウントを作成
          </Link>
        </div>
      ) : (
        <></>
      )}
      <div>{err}</div>
    </>
  )

  // tsx.
  return (
    <>
      <Head>
        <title>{title()}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <main>
        <Container className={styles.container}>
          <Row>
            <Col>{title()}</Col>
          </Row>
          <Row>
            <MyForm
              formItems={formItems}
              formRef={formRef}
              errors={errors}
              register={register}
              styles={styles}
              extraComponent={extraComponent}
            />
          </Row>
        </Container>
      </main>
    </>
  )
}

export default UserAuth
