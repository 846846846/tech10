'use strict'
import { NextPage } from 'next'
import Head from 'next/head'
import GlobalNav from '../components/GlobalNav'
import Table from '../components/Table'

const Memo: NextPage = () => {
  return (
    <>
      <Head>
        <title>Memo App</title>
      </Head>
      <main>
        <GlobalNav />
        <Table />
      </main>
    </>
  )
}

export default Memo
