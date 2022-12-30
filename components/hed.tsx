import type { FC, ReactNode } from 'react'
import Head from 'next/head'

type Props = {
  title?: string
  desc?: string
  children?: ReactNode
}

const Hed: FC<Props> = ({ title, desc, children }) => {
  const defaultTitle = 'Tomohisa Oda'
  const t = title === '' || title === undefined ? defaultTitle : `${title} - ${defaultTitle}`
  return (
    <Head>
      <title>{t}</title>
      {desc && <meta name="description" content={desc} />}
      {children}
    </Head>
  )
}

export default Hed