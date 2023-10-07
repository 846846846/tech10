import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Container, Row, Image } from 'react-bootstrap'
import { GoodsAPI } from '../../webapi/entity/goods'
import { MetaAPI } from '../../webapi/entity/meta'
import GlobalNav from '../../components/buyer/GlobalNav'
import styles from '../../styles/Buyer.module.scss'

// constant declaration.
const DUMMY_IMAGE = 'https://placehold.jp/150x150.png'

/**
 *
 * @returns
 */
const GoodsView: NextPage = () => {
  // hooks.
  const [data, setData] = useState<Goods>()

  const router = useRouter()
  const { Id } = router.query

  useEffect(() => {
    const fetchData = async () => {
      try {
        // コンポーネントの初期レンダリング時にはundefinedとなるためガードする.
        if (Id !== undefined) {
          // 1. 商品情報の詳細を取得する.
          const goodsApi = new GoodsAPI()
          const res = await goodsApi.readDetail(Id as string)

          // 2. 画像情報が格納されたS3のPresginedURLを取得する.
          const metaApi = new MetaAPI()
          const url =
            res.data.image === 'dummy'
              ? DUMMY_IMAGE
              : await metaApi
                  .generatePresignedUrl(
                    {
                      name: res.data.image,
                    },
                    false
                  )
                  .then((result) => result.data.url)

          // 3. stateにセットする.
          res.data.image = url
          setData(res.data)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [Id])

  console.log(data)

  // tsx.
  return (
    <Container>
      <Row className={styles.row}>
        <GlobalNav />
        <div className={styles.view}>
          <div>{data?.id}</div>
          <div>{data?.name}</div>
          <div>{data?.price}</div>
          <div>{data?.owner}</div>
          <div>
            <Image src={data?.image} className={styles.image} rounded />
          </div>
        </div>
      </Row>
    </Container>
  )
}

export default GoodsView
