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
        .container {
          margin: var(--spacing-20) auto;
          max-width: 1800px;
        }
        .content {
          margin: 0 auto;
        }
      `}</style>
    </div>
  )
}

export default MyApp
