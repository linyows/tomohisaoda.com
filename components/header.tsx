import React, { ReactNode } from 'react'
import Link from 'next/link'

type Props = {
  children?: ReactNode
}

const name = `Tomohisa Oda`

const Header: React.FC<Props> = ({ children }) => {
  return (
    <>
      <header>
        <h1 className="site-name neumorphism-h"><Link href="/">{name}</Link></h1>
        <nav>
          <ul>
            <li> <Link href="/blog" passHref>
              <a><span role="img" aria-label="surf">🏄‍♂️</span> Blog</a>
            </Link> </li>
            <li> <Link href="/projects" passHref>
              <a><span role="img" aria-label="home">🎪</span> Projects</a>
            </Link> </li>
            <li> <Link href="/activities" passHref>
              <a><span role="img" aria-label="bike">🚴‍♂️</span> Activities</a>
            </Link> </li>
            <li> <Link href="/contact" passHref>
              <a><span role="img" aria-label="contact">🤙</span> Contact</a>
            </Link> </li>
          </ul>
        </nav>
      </header>

      <style jsx>{`
        header {
          display: grid;
          grid-template-columns: 160px 1fr 1fr;
          gap: var(--spacing-10);
          margin-left: var(--spacing-20);
          margin-right: var(--spacing-20);
          margin-bottom: var(--spacing-10);
        }
        .site-name {
          font-size: var(--fontSize-0);
          margin: 0;
          text-align: center;
        }
        nav {
          margin: 0;
        }
        ul {
          list-style-type: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          gap: var(--spacing-10);
        }
        li {
          font-family: var(--fontFamily-sans);
          margin: 0;
          text-align: center;
          white-space: nowrap;
        }
        nav a {
          text-decoration: none;
          display: block;
          margin: 0;
          padding: var(--spacing-2) var(--spacing-5);
          color: #555;
        }
        nav a:hover {
          background: #e0e0e0;
          border-radius: 30px;
        }
        nav span {
          padding-right: var(--spacing-2);
        }
      `}</style>
    </>
  )
}

export default Header
