import '@/styles/globals.css'
import { Noto_Sans_JP } from '@next/font/google'
import type { AppProps } from 'next/app'
import '@/styles/reset.min.css'

import 'primeicons/primeicons.css'
import 'primereact/resources/primereact.min.css'
import 'primereact/resources/themes/lara-light-indigo/theme.css'

const notoSansJP = Noto_Sans_JP({
  weight: '400',
  subsets: ['latin']
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${notoSansJP.style.fontFamily};
        }
      `}</style>

      <Component {...pageProps} />
    </>
  )
}