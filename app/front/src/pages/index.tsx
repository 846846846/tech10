'use strict'
import Head from 'next/head'
import Link from 'next/link'
import UserAuth from './users/UserAuth'

const Top = () => {
  return (
    <>
      <Head>
        <title>top</title>
      </Head>
      <main>
        <UserAuth />
        {/* <Link href="seller/GoodsRegist">販売者/商品登録</Link>
        <br />
        <Link href="buyer/GoodsList">購入者/商品一覧</Link>
        <br /> */}
      </main>
    </>
  )
}

export default Top
