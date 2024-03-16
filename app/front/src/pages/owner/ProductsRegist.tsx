import { NextPage } from 'next'
import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Alert } from 'react-bootstrap'
import { AxiosError } from 'axios'
import styles from './Owner.module.scss'
import EntityAPI from '../../libs/webapi/entity'
import MetaAPI from '../../libs/webapi/meta'
import Form, { FormItem } from '@/components/Form'
import NavBar from '@/components/NavBar'
import SubmitButtons from '@/components/SubmitButtons'

/**
 *
 * @returns
 */
const ProductsRegist: NextPage = () => {
  // hooks.
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Products>()
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    reset()
  }, [reset])

  const [upload, setUpload] = useState<number>(0)

  // handler.
  const onSubmit = async (data: Products) => {
    console.log(data)
    try {
      const metaApi = new MetaAPI()

      // 1. 画像アップロード先となるS3のPresignedURLを取得.
      const presignedUrl = await metaApi
        .generatePresignedUrl(
          {
            name: data.image[0].name,
            type: data.image[0].type,
          },
          true
        )
        .then((value) => value.data.url)

      // 2. S3のPresignedURLに画像をアップロード.
      await metaApi.uploadPresignedUrl(presignedUrl, data.image[0])

      // 3. ImageをS3キーのURLで更新.
      const urlObj = new URL(presignedUrl)
      data.image = []
      data.image.push(urlObj.pathname.split('/').slice(-2).join('/'))

      // 4. 商品情報を登録.
      const res = await new EntityAPI('products').create(data)
      setUpload(res.status)
      reset()
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error(err?.response)
        setUpload(err?.response?.status as number)
      } else {
        console.error(err)
      }
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

  // extraComponent.
  const extraComponent = (
    <SubmitButtons
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  )

  // tsx.
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <main className={styles.main}>
        <NavBar />
        <div className={styles.regist}>
          <Alert
            variant={upload === 201 ? 'success' : 'danger'}
            className={styles.alert}
            onClose={() => setUpload(0)}
            show={upload !== 0}
            dismissible
          >
            {upload === 201 ? (
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
          <Form
            formItems={formItems}
            formRef={formRef}
            errors={errors}
            register={register}
            extraComponent={extraComponent}
          />
        </div>
      </main>
    </>
  )
}

export default ProductsRegist
