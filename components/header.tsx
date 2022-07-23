import React, { ReactNode, useState, useRef, useEffect } from 'react'
import Link from 'next/link'

type Props = {
  children?: ReactNode
}

const Header: React.FC<Props> = ({ children }) => {
  const [open, setOpen] = useState(false)

  const useOnClickOutside = (ref, handler) => {
    useEffect(() => {
      const listener = event => {
        if (!ref.current || ref.current.contains(event.target)) {
          return
        }
        handler(event)
      }
      document.addEventListener('mousedown', listener)
      return () => {
        document.removeEventListener('mousedown', listener)
      }
    }, [ref, handler])
  }

  const node = useRef()
  useOnClickOutside(node, () => setOpen(false))

  return (
    <>
      <header className="header">
        <h1 className="site-name neumorphism-h">
          <Link href="/">
            <a>Tomohisa Oda</a>
          </Link>
        </h1>

        <nav className="global-nav">
          <ul>
            <li> <Link href="/projects">
              <a><span role="img" aria-label="home">🎪</span> Projects</a>
            </Link> </li>
            <li> <Link href="/blog">
              <a><span role="img" aria-label="surf">🏄‍♂️</span> Blog</a>
            </Link> </li>
            <li> <Link href="/activities">
              <a><span role="img" aria-label="bike">🚴‍♂️</span> Activities</a>
            </Link> </li>
            <li> <Link href="/contact">
              <a><span role="img" aria-label="contact">🤙</span> Contact</a>
            </Link> </li>
          </ul>
        </nav>

        <div ref={node}>
          <button aria-controls="burger" aria-expanded={open} className="burger" onClick={() => setOpen(!open)}>
            <span />
            <span />
            <span />
          </button>
          <nav className="burger-nav" aria-hidden={!open} onClick={() => setOpen(!open)}>
            <ul>
              <li> <Link href="/projects">
                <a><span role="img" aria-label="home">🎪</span> Projects</a>
              </Link> </li>
              <li> <Link href="/blog">
                <a><span role="img" aria-label="surf">🏄‍♂️</span> Blog</a>
              </Link> </li>
              <li> <Link href="/activities">
                <a><span role="img" aria-label="bike">🚴‍♂️</span> Activities</a>
              </Link> </li>
              <li> <Link href="/contact">
                <a><span role="img" aria-label="contact">🤙</span> Contact</a>
              </Link> </li>
            </ul>
          </nav>
        </div>
      </header>

      <style jsx>{`
        .header {
          display: grid;
          grid-template-columns: 160px 1fr 1fr;
          gap: var(--spacing-10);
          margin-left: var(--spacing-20);
          margin-right: var(--spacing-20);
          margin-bottom: var(--spacing-10);
        }
        .site-name {
          width: 160px;
          font-size: var(--fontSize-0);
          margin: 0;
          text-align: center;
        }
        .global-nav {
          margin: 0;
        }
        .global-nav ul {
          list-style-type: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          gap: var(--spacing-10);
        }
        .global-nav li {
          font-family: var(--fontFamily-sans);
          margin: 0;
          text-align: center;
          white-space: nowrap;
        }
        .global-nav a {
          text-decoration: none;
          display: block;
          margin: 0;
          padding: var(--spacing-2) var(--spacing-5);
          color: #555;
        }
        .global-nav a:hover {
          background: #e0e0e0;
          border-radius: 30px;
        }
        .global-nav span {
          padding-right: var(--spacing-2);
        }
        .burger {
          display: none;
        }
        .burger-nav {
          display: none;
        }

        @media (max-width: 1000px) {
          .header {
            display: block;
          }
          .global-nav {
            display: none;
          }
          .burger {
            display: flex;
            position: fixed;
            top: var(--spacing-20);
            right: var(--spacing-20);
            flex-direction: column;
            justify-content: space-around;
            width: var(--spacing-6);
            height: var(--spacing-8);
            background: transparent;
            border: none;
            cursor: pointer;
            padding: 0;
            z-index: 10;
          }
          .burger span {
            width: var(--spacing-8);
            height: var(--spacing-1);
            background: var(--color-text-light);
            border-radius: 10px;
            transition: all 0.3s linear;
            position: relative;
            transform-origin: 1px;
          }
          .burger span:first-child {
            transform: rotate(${open ? '45deg' : '0'});
          }
          .burger span:nth-child(2) {
            opacity: ${open ? '0' : '1'};
            transform: translateX(${open ? '20px' : '0'});
            width: var(--spacing-6);
          }
          .burger span:nth-child(3) {
            transform: rotate(${open ? '-45deg' : '0'});
          }
          .burger-nav {
            display: flex;
            flex-direction: column;
            justify-content: center;
            background: #fff;
            height: 100vh;
            text-align: left;
            position: fixed;
            top: 0;
            left: 50%;
            width: 50%;
            z-index: 5;
            transform: translateX(${open ? '0' : '100%'});
            transition: transform 0.3s ease-in-out;
          }
          .burger-nav ul {
            list-style-type: none;
            margin: 0;
            padding: var(--spacing-10);
          }
          .burger-nav li {
            margin: 0;
            padding: 0;
          }
          .burger-nav a {
            display: block;
            font-size: var(--fontSize-3);
            font-family: var(--fontFamily-sans);
            font-weight: bold;
            text-decoration: none;
            padding: var(--spacing-10);
            margin: 0;
            transition: color 0.3s linear;
            background: #fff;
            color: #555;
          }
        }
        @media (max-width: 480px) {
          .header {
            margin-left: var(--spacing-10);
            margin-right: var(--spacing-10);
          }
          .burger {
            top: var(--spacing-10);
            right: var(--spacing-12);
          }
          .burger-nav ul {
            padding: 0;
          }
          .burger-nav a {
            font-size: var(--fontSize-1);
          }
        }
      `}</style>
    </>
  )
}

export default Header
