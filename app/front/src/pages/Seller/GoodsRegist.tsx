'use strict'
import { NextPage } from 'next'
import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import GlobalNav from '@/components/GlobalNav'
import SideMenu from '@/components/SideMenu'
import NoticeArea from '@/components/NoticeArea'
import { GoodsAPI } from '../../webapi/entity/goods'
import { MetaAPI } from '../../webapi/entity/meta'
import styles from '../../styles/GoodsRegist.module.scss'

// type definition
type Goods = {
  id: string
  name: string
  explanation: string
  price: string
  image: any
  category: string
}

type FormItem = {
  id: keyof Goods
  type: string
  label: string
  text: string
}

enum UploadStatus {
  Idle,
  Doing,
  Success,
  Error,
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
    setValue,
    reset,
  } = useForm<Goods>()
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    reset()
  }, [reset])

  const [upload, setUpload] = useState<UploadStatus>(UploadStatus.Idle)

  // handler.
  const onSubmit = async (data: Goods) => {
    try {
      setUpload(UploadStatus.Doing)

      // 1. image upload.
      console.log(data.image)
      const formData = new FormData()
      formData.append('file', data.image[0], data.image[0].name)
      console.log(formData)

      const metaApi = new MetaAPI()
      const res = await metaApi.generatePresignedUrl()
      const res2 = await metaApi.uploadPresignedUrl(res.data.url, data.image[0])
      const { status: status2 } = { ...res2 }
      if (status2 !== 200) {
        throw new Error(`image upload err: ${status2}`)
      } else {
        // pickup s3 key name.
        const urlObj = new URL(res.data.url)
        const match = urlObj.pathname.match(/[^/]+.jpeg$/)
        if (match !== null) {
          data.image = match[0] // update image name with s3 key name.
        } else {
          throw new Error('not found s3 key name')
        }
      }

      // 2. post input info.
      const goodsApi = new GoodsAPI()
      const res3 = await goodsApi.create(data)
      const { status: status3 } = { ...res3 }
      if (status3 !== 200) {
        throw new Error(`post input info: ${status3}`)
      }
      setUpload(UploadStatus.Success)
    } catch (err) {
      setUpload(UploadStatus.Error)
      console.error(err)
    }
  }

  const onClose = () => {}

  // display.
  const title = '商品登録'
  const formItems: Array<FormItem> = [
    {
      id: 'id',
      type: 'text',
      label: '商品ID',
      text: '一意の識別子。各商品を一意に識別するための番号やコード。',
    },
    {
      id: 'name',
      type: 'text',
      label: '商品名',
      text: '商品の名称。顧客（購入者）が商品を検索や認識するための名前。',
    },
    {
      id: 'explanation',
      type: 'textarea',
      label: '商品説明',
      text: '商品の詳細な情報や特徴を説明するテキスト。',
    },
    {
      id: 'price',
      type: 'number',
      label: '商品価格',
      text: '商品の販売価格。',
    },
    {
      id: 'image',
      type: 'file',
      label: '商品画像',
      text: '商品の実際の見た目を示す写真やイラスト。',
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
            <Form ref={formRef} className={styles.form}>
              {formItems.map((item, index) => {
                const { label, text, type, id } = { ...item }
                return (
                  <Form.Group className="mb-3" key={index}>
                    <Form.Label className={styles.label}>{label}</Form.Label>
                    <Form.Text className={styles.text} muted>
                      {text}
                    </Form.Text>
                    {type === 'textarea' ? (
                      <Form.Control as={type} rows={3} {...register(id)} />
                    ) : (
                      <Form.Control type={type} {...register(id)} />
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
