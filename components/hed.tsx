import type { FC, ReactNode } from 'react'
import Head from 'next/head'

type Props = {
  title?: string
  desc?: string
  ogimage?: string
  path?: string
  children?: ReactNode
}

const Hed: FC<Props> = ({ title, desc, ogimage, path, children }) => {
  const defaultTitle = 'Tomohisa Oda'
  const defaultDesc = `Software Engineer, researcher, and writer, living in Fukuoka Japan.`
  const defaultUrl = `https://tomohisaoda.com`
  const t = title === '' || title === undefined ? defaultTitle : `${title} - ${defaultTitle}`
  const d = desc === '' || desc === undefined ? defaultDesc : desc
  const url = path === '' || path === undefined ? defaultUrl : `${defaultUrl}${path}`
  return (
    <Head>
      <title>{t}</title>
      {d && <meta name="description" content={d} />}
      <meta property="og:site_name" content={t} />
      {d && <meta property="og:description" content={d} />}
      {ogimage && <meta property="og:image" content={`${defaultUrl}/${ogimage}`} />}
      {ogimage && <meta property="og:image:width" content="1600" />}
      {ogimage && <meta property="og:image:height" content="630" />}
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <link rel="canonical" href={url} />
      {children}
    </Head>
  )
}

export default Hed