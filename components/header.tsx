import React, { ReactNode, useState, useRef, useEffect, MutableRefObject } from 'react'
import Link from 'next/link'

type Props = {
  children?: ReactNode
}

const Header: React.FC<Props> = ({ children }) => {
  const [open, setOpen] = useState(false)

  const useOnClickOutside = (ref: MutableRefObject<HTMLElement | null>, handler: Function) => {
    useEffect(() => {
      const listener = (event: MouseEvent) => {
        const el = ref?.current
        if (!el || el.contains(event.target as Node)) {
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

  const node = useRef<HTMLDivElement | null>(null)
  useOnClickOutside(node, () => setOpen(false))

  return (
    <>
      <header className="header">
        <h1 className="site-name neumorphism-h">
          <Link href="/">
            Tomohisa Oda
          </Link>
        </h1>

        <nav className="global-nav">
          <ul>
            <li>
              <Link href="/projects">
                <span role="img" aria-label="home">🎪</span> Projects
              </Link>
            </li>
            <li>
              <Link href="/blog">
                <span role="img" aria-label="surf">🏄‍♂️</span> Blog
              </Link>
            </li>
            <li>
              <Link href="/activities">
                <span role="img" aria-label="bike">🚴‍♂️</span> Activities
              </Link>
            </li>
            <li>
              <Link href="/contact">
                <span role="img" aria-label="contact">🤙</span> Contact
              </Link>
            </li>
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
              <li>
                <Link href="/projects">
                  <span role="img" aria-label="home">🎪</span> Projects
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <span role="img" aria-label="surf">🏄‍♂️</span> Blog
                </Link>
              </li>
              <li>
                <Link href="/activities">
                  <span role="img" aria-label="bike">🚴‍♂️</span> Activities
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <span role="img" aria-label="contact">🤙</span> Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <style jsx>{`
        @media (max-width: 1000px) {
          .burger span:first-child {
            transform: rotate(${open ? '45deg' : '0'});
          }
          .burger span:nth-child(2) {
            opacity: ${open ? '0' : '1'};
            transform: translateX(${open ? '20px' : '0'});
          }
          .burger span:nth-child(3) {
            transform: rotate(${open ? '-45deg' : '0'});
          }
          .burger-nav {
            transform: translateX(${open ? '0' : '100%'});
          }
      `}</style>
    </>
  )
}

export default Header
