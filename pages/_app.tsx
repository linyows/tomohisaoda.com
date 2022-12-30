import '../styles/globals.css'
import 'normalize.css/normalize.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Header from '../components/header'
import Footer from '../components/footer'
import GA from '../components/ga'
import 'notionate/dist/styles/notionate.css'
import 'notionate/dist/styles/notionate-dark.css'

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
    </>
  )
}

export default MyApp
