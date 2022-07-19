import { useState } from 'react'
import type { GetStaticProps, NextPage } from 'next'
import Link from 'next/link'

type Props = {
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  return {
    props: {},
    revalidate: 10
  }
}

const asciiart = `
         ,
       _=|_
     _[_## ]_
_  +[_[_+_]P/    _    |_       ____      _=--|-~
 ~---\_I_I_[=\--~ ~~--[o]--==-|##==]-=-~~  o]H
-~ /[_[_|_]_]\\  -_  [[=]]    |====]  __  !j]H
  /    "|"    \      ^U-U^  - |    - ~ .~  U/~
 ~~--__~~~--__~~-__   H_H_    |_     --   _H_
-. _  ~~~#######~~~     ~~~-    ~~--  ._ - ~~-=
           ~~~=~~  -~~--  _     . -      _ _ -

       ----------------------------------
      |        June, 20th, 1969          |
      |  Here Men from the Planet Earth  |
      |   First set Foot upon the Moon   |
      | We came in Peace for all Mankind |
       ---------------------------=apx=--

`

const Notfound: NextPage<Props> = ({}) => {
  return (
    <>
      <header className="grider category-header">
        <span></span>
        <div>
          <h1>404</h1>
          <p>Looks like this page is unavailable.</p>
        </div>
      </header>

      <section className="grider">
        <span></span>
        <div>
          <pre>
            <code>
              {asciiart}
            </code>
          </pre>
          <p className="home">
            <Link href="/">
              <a className="to-home neumorphism-h">Go back to 🏠</a>
            </Link>
          </p>
        </div>
      </section>

      <style jsx>{`
        .home {
          margin-top: var(--spacing-20);
        }
        .to-home {
          text-align: center;
          font-size: var(--fontSize-1);
          text-decoration: none;
          display: inline-block;
          padding: var(--spacing-2) var(--spacing-8) var(--spacing-3);
          border-radius: 30px;
          font-family: var(--fontFamily-sans);
          margin: 0 auto;
          margin-bottom: var(--spacing-20);
        }
      `}</style>
    </>
  )
}

export default Notfound
