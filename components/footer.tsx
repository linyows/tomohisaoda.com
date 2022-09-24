import React, { ReactNode } from 'react'
import Link from 'next/link'

type Props = {
  children?: ReactNode
}

const Footer: React.FC<Props> = ({ children }) => {
  return (
    <footer className="footer grider">
      <span></span>
      <p className="site-license">
        &copy; <Link href="/">Tomohisa Oda</Link>. {` `}
        Powered by Next.js, Notion, GitHub, Cloudflare and {` `}
        <a href="https://lolipop.jp/" target="_blank" rel="noopener noreferrer">Lolipop</a>.
      </p>
    </footer>
  )
}

export default Footer
