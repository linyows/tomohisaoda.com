import '../styles/globals.css'
import 'normalize.css/normalize.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Header from '../components/header'
import Footer from '../components/footer'
import 'notionate/dist/styles/notionate.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="alternate" type="application/rss+xml" href="/index.xml" title="RSS2.0" />
      </Head>

      <div className="container">
        <Head>
          <title>Tomohisa Oda</title>
        </Head>

        <div className="header">
          <Header />
        </div>

        <div className="content">
          <Component {...pageProps} />
        </div>

        <div className="footer">
          <Footer />
        </div>
      </div>
    </>
  )
}

export default MyApp
