'use strict'
import Head from 'next/head'
import Link from 'next/link'
import Memo from './Memo'

const Top = () => {
  return (
    <>
      <Head>
        <title>top</title>
      </Head>
      <main>
        <Link href="/Memo">メモアプリ</Link>
      </main>
    </>
  )
}

export default Top
