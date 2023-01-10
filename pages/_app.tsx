import '../styles/globals.css'
import 'normalize.css/normalize.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Noto_Sans_JP, Noto_Serif_JP } from '@next/font/google'
import Header from '../components/header'
import Footer from '../components/footer'
import GA from '../components/ga'
import 'notionate/dist/styles/notionate.css'
import 'notionate/dist/styles/notionate-dark.css'

const notosans = Noto_Sans_JP({
  weight: ['400', '900'],
  subsets: ['japanese'],
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
  ],
})
const notoserif = Noto_Serif_JP({
  weight: ['400', '900'],
  subsets: ['japanese'],
  fallback: [
    'Noto Serif JP',
    'Merriweather',
    'Georgia',
    'Cambria',
    'Times New Roman',
    'Times',
    'serif',
  ],
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
