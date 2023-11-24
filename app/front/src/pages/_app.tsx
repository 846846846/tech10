import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import 'bootstrap/dist/css/bootstrap.min.css'
import { GenericInfoProvider } from '../components/context/GenericContext'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GenericInfoProvider>
      <Component {...pageProps} />
    </GenericInfoProvider>
  )
}
