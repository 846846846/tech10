'use strict'
import { NextPage } from 'next'
import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Form, Alert } from 'react-bootstrap'
import GlobalNav from '@/components/seller/GlobalNav'
import SideMenu from '@/components/seller/SideMenu'
import NoticeArea from '@/components/seller/NoticeArea'
import { GoodsAPI } from '../../webapi/entity/goods'
import { MetaAPI } from '../../webapi/entity/meta'
import styles from '../../styles/Seller.module.scss'
import { AxiosError } from 'axios'

// local type definition
type FormItem = {
  id: keyof Goods
  type: string
  label: string
  text: string
  options?: any
}

/**
 *
 * @returns
 */
const GoodsRegist: NextPage = () => {
  // hooks.
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Goods>()
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    reset()
  }, [reset])

  const [upload, setUpload] = useState<number>(0)

  // handler.
  const onSubmit = async (data: Goods) => {
    try {
      // 1. image upload.
      const metaApi = new MetaAPI()
      const resGenPresignedUrl = await metaApi.generatePresignedUrl(
        {
          name: data.image[0].name,
          type: data.image[0].type,
        },
        true
      )
      await metaApi.uploadPresignedUrl(
        resGenPresignedUrl.data.url,
        data.image[0]
      )
      const urlObj = new URL(resGenPresignedUrl.data.url)
      data.image = urlObj.pathname.split('/').pop() // update image name with s3 key name.

      // 2. post input info.
      const goodsApi = new GoodsAPI()
      const resCreate = await goodsApi.create(data)
      setUpload(resCreate.status)
      reset()
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err?.response)
        setUpload(err?.response?.status as number)
      }
      console.error(err)
    }
  }

  const onClose = () => {
    setUpload(0)
    reset()
  }

  // display.
  const title = '商品登録'
  const formItems: Array<FormItem> = [
    {
      id: 'id',
      type: 'text',
      label: '商品ID',
      text: '一意の識別子。各商品を一意に識別するための番号やコード。',
      options: {
        required: { value: true, message: '入力必須のパラメータです。' },
        pattern: {
          value: /^[a-zA-Z0-9]{1,10}$/,
          message: '半角英数字かつ1文字から10文字で入力してください。',
        },
      },
    },
    {
      id: 'name',
      type: 'text',
      label: '商品名',
      text: '商品の名称。顧客（購入者）が商品を検索や認識するための名前。',
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
      label: '商品説明',
      text: '商品の詳細な情報や特徴を説明するテキスト。',
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
      label: '商品価格',
      text: '商品の販売価格。',
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
      label: '商品画像',
      text: '商品の実際の見た目を示す写真やイラスト。',
      options: {
        required: { value: true, message: '入力必須のパラメータです。' },
      },
    },
    {
      id: 'category',
      type: 'text',
      label: 'カテゴリ',
      text: '商品の分類。例：「家電」「ファッション」「食品」など。',
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
        <GlobalNav />
        <div className={styles.container}>
          <SideMenu />
          <div className={styles.main}>
            <Alert
              variant={upload === 200 ? 'success' : 'danger'}
              className={styles.alert}
              onClose={() => setUpload(0)}
              show={upload !== 0}
              dismissible
            >
              {upload === 200 ? (
                <span>
                  商品情報の登録が完了しました。プレビューはこちらから。
                  <Alert.Link href="#">goods preview(TBD)</Alert.Link>
                </span>
              ) : (
                <span>
                  商品情報の登録に失敗しました。
                  {upload === 409 ? '商品IDが重複しています。' : ''}
                </span>
              )}
            </Alert>
            <Form ref={formRef} className={styles.form}>
              {formItems.map((item, index) => {
                const { label, text, type, id, options } = { ...item }
                return (
                  <Form.Group className="mb-3" key={index}>
                    <Form.Label className={styles.label}>{label}</Form.Label>
                    <Form.Text className={styles.text} muted>
                      {text}
                    </Form.Text>
                    {type === 'textarea' ? (
                      <Form.Control
                        as={type}
                        rows={3}
                        isInvalid={errors[id] !== undefined}
                        {...register(id, options)}
                      />
                    ) : (
                      <Form.Control
                        type={type}
                        isInvalid={errors[id] !== undefined}
                        {...register(id, options)}
                      />
                    )}
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
                  onClick={onClose}
                >
                  キャンセル
                </Button>
                <Button
                  className={styles.buttonItem}
                  variant="primary"
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                >
                  保存
                </Button>
              </div>
            </Form>
          </div>
          <NoticeArea />
        </div>
      </main>
    </>
  )
}

export default GoodsRegist
