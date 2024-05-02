import 'rotion/style.css'
import '../styles/globals.css'
import 'normalize.css/normalize.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Header from '../components/header'
import Footer from '../components/footer'
import GA from '../components/ga'
import { notosans, notoserif } from '../src/lib/fonts'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="alternate" type="application/rss+xml" href="/index.xml" title="RSS2.0" />
      </Head>

      <GA />

      <div className="accent"></div>

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
