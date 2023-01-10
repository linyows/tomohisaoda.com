import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    const name = `Tomohisa Oda`
    const desc = `Software Engineer, researcher, and writer, living in Fukuoka Japan.`
    const url = `https://tomohisaoda.com`
    return (
      <Html lang="ja">
        <Head>
          <meta property="og:url" content={url} />
          <meta property="og:type" content="website" />
          <meta property="og:description" content={desc} />
          <meta property="og:site_name" content={name} />
          <meta name="description" content={desc}></meta>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
