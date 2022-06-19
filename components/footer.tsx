import React, { ReactNode } from 'react'
import Link from 'next/link'

type Props = {
  children?: ReactNode
}

const Footer: React.FC<Props> = ({ children }) => {
  return (
    <>
      <footer>
        <span></span>
        <p className="site-license">
          &copy; <Link href="/">Tomohisa Oda</Link>. Powered by Next.js, Notion and {` `}
          <a href="https://lolipop.jp/" target="_blank" rel="noopener noreferrer">Lolipop</a>.
        </p>
      </footer>

      <style jsx>{`
        footer {
          display: grid;
          grid-template-columns: 180px 1fr;
          gap: var(--spacing-10);
          margin-top: var(--spacing-5);
          margin-left: var(--spacing-20);
          margin-right: var(--spacing-20);
          padding: var(--spacing-20) 0 var(--spacing-10);
          font-family: var(--fontFamily-sans);
        }
        .site-license {
          font-size: var(--fontSize-0);
          margin: 0;
        }
      `}</style>
    </>
  )
}

export default Footer
