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
})
const notoserif = Noto_Serif_JP({
  weight: ['400', '900'],
  subsets: ['japanese'],
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main className={`${notosans.className} ${notoserif.className}`}>
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
    </main>
  )
}

export default MyApp
