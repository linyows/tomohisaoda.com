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
        Powered by Next.js, Cloudflare, Lolipop and {` `}
        <a href="https://rotion.linyo.ws/" target="_blank" rel="noopener noreferrer">Rotion</a>.
      </p>
    </footer>
  )
}

export default Footer
