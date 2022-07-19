import React, { ReactNode } from 'react'
import Link from 'next/link'

type Props = {
  children?: ReactNode
}

const Footer: React.FC<Props> = ({ children }) => {
  return (
    <>
      <footer className="grider">
        <span></span>
        <p className="site-license">
          &copy; <Link href="/">Tomohisa Oda</Link>. Powered by Next.js, Notion, GitHub, Cloudflare and {` `}
          <a href="https://lolipop.jp/" target="_blank" rel="noopener noreferrer">Lolipop</a>.
        </p>
      </footer>

      <style jsx>{`
        footer {
          margin-top: var(--spacing-5);
        }
        .site-license {
          font-family: var(--fontFamily-sans);
          font-size: var(--fontSize-0);
          margin: 0;
        }
      `}</style>
    </>
  )
}

export default Footer
