import '../styles/globals.css'
import 'normalize.css/normalize.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/header'
import Footer from '../components/footer'
//import 'prismjs/themes/prism-tomorrow.css'

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

        <style jsx>{`
        `}</style>
      </div>
    </>
  )
}

export default MyApp
