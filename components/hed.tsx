import type { FC, ReactNode } from 'react'
import Head from 'next/head'

type Props = {
  title: string
  desc: string
  children?: ReactNode
}

const Hed: FC<Props> = ({ title, desc, children }) => {
  const suffix = ` – Tomohisa Oda`
  return (
    <Head>
      <title>{`${title}${suffix}`}</title>
      <meta name="description" content={desc} />
      {children}
    </Head>
  )
}

export default Hed