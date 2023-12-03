'use strict'
import Head from 'next/head'
import Link from 'next/link'
import Signin from '../pages/users/Signin'

const Top = () => {
  return (
    <>
      <Head>
        <title>top</title>
      </Head>
      <main>
        <Signin />
        {/* <Link href="seller/GoodsRegist">販売者/商品登録</Link>
        <br />
        <Link href="buyer/GoodsList">購入者/商品一覧</Link>
        <br />
        <Link href="users/Signup">管理者/サインアップ</Link>
        <br />
        <Link href="users/confirmSignUp">管理者/サインアップ(確認)</Link>
        <br />
        <Link href="users/Signin">管理者/サインイン</Link>
        <br /> */}
      </main>
    </>
  )
}

export default Top
