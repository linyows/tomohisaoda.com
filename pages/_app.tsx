import '../styles/globals.css'
import 'normalize.css/normalize.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import localFont from '@next/font/local'
import Header from '../components/header'
import Footer from '../components/footer'
import GA from '../components/ga'
import 'notionate/dist/styles/notionate.css'
import 'notionate/dist/styles/notionate-dark.css'

const notosans = localFont({
  src: [
    {
      path: './src/fonts/NotoSansJP-Black.woff2',
      weight: '900',
      style: 'normal',
    },
    {
      path: './src/fonts/NotoSansJP-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  fallback: [
    'Noto Sans JP',
    'Montserrat',
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'Noto Sans',
    'sans-serif',
    'Apple Color Emoji',
    'Segoe UI Emoji',
    'Segoe UI Symbol',
    'Noto Color Emoji',
  ]
})
const notoserif = localFont({
  src: [
    {
      path: './src/fonts/NotoSerifJP-Black.woff2',
      weight: '900',
      style: 'normal',
    },
    {
      path: './src/fonts/NotoSerifJP-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  fallback: [
    'Noto Serif JP',
    'Merriweather',
    'Georgia',
    'Cambria',
    'Times New Roman',
    'Times',
    'serif',
  ]
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="alternate" type="application/rss+xml" href="/index.xml" title="RSS2.0" />
      </Head>

      <GA />

      <div className="container">
        <div>
          <Header />
        </div>

        <div className="content">
          <Component {...pageProps} />
        </div>

        <div>
          <Footer />
        </div>
      </div>

      <style jsx global>{`
        :root {
          --fontFamily-sans: ${notosans.style.fontFamily};
          --fontFamily-serif: ${notoserif.style.fontFamily};
        }
      `}</style>
    </>
  )
}

export default MyApp
