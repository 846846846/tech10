'use strict'
import Head from 'next/head'
import Link from 'next/link'
import GoodsRegist from './Seller/GoodsRegist'

const Top = () => {
  return (
    <>
      <Head>
        <title>top</title>
      </Head>
      <main>
        <Link href="Seller/GoodsRegist">販売者/商品登録</Link>
      </main>
    </>
  )
}

export default Top
