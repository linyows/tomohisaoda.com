import type { FC, ReactNode } from 'react'
import Head from 'next/head'

type Props = {
  title?: string
  desc?: string
  ogimage?: string
  children?: ReactNode
}

const Hed: FC<Props> = ({ title, desc, ogimage, children }) => {
  const defaultTitle = 'Tomohisa Oda'
  const defaultDesc = `Software Engineer, researcher, and writer, living in Fukuoka Japan.`
  const t = title === '' || title === undefined ? defaultTitle : `${title} - ${defaultTitle}`
  const d = desc === '' || desc === undefined ? defaultDesc : desc
  const url = 'https://tomohisaoda.com'
  return (
    <Head>
      <title>{t}</title>
      {d && <meta name="description" content={d} />}
      <meta property="og:site_name" content={t} />
      {d && <meta property="og:description" content={d} />}
      {ogimage && <meta property="og:image" content={`${url}/${ogimage}`} />}
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      {children}
    </Head>
  )
}

export default Hed