import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { GenericInfoProvider } from '../libs/context/GenericContext'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  useEffect(() => {
    const path = router.pathname
    if (path.startsWith('/users/')) return
  }, [router])

  return (
    <GenericInfoProvider>
      <Component {...pageProps} />
    </GenericInfoProvider>
  )
}
