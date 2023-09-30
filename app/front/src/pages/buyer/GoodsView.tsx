import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Image from 'react-bootstrap/Image'
import { GoodsAPI } from '../../webapi/entity/goods'
import { MetaAPI } from '../../webapi/entity/meta'
import GlobalNav from '../../components/buyer/GlobalNav'
import styles from '../../styles/Buyer.module.scss'

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
          const res2 = await metaApi.generatePresignedUrl(
            {
              name: res.data.image,
            },
            false
          )

          // 3. stateにセットする.
          res.data.image = res2.data.url
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
