import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { GenericInfoProvider } from '../components/GenericContext'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  useEffect(() => {
    const path = router.pathname
    if (path.startsWith('/users/')) return

    // const jwt = localStorage.getItem('jwtToken')
    // if (!jwt) router.push('/users/Signin')
  }, [router])

  return (
    <GenericInfoProvider>
      <Component {...pageProps} />
    </GenericInfoProvider>
  )
}
