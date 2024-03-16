import Head from 'next/head'
import UserAuth from './users/UserAuth'

const Top = () => {
  return (
    <>
      <Head>
        <title>top</title>
      </Head>
      <main>
        <UserAuth />
      </main>
    </>
  )
}

export default Top
