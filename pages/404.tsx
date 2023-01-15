import { useState } from 'react'
import type { GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
import Hed from '../components/hed'
import { MakeOgImage } from '../src/lib/ogimage'

type Props = {
  ogimage?: string
}

const title = '404'
const desc = 'Looks like this page is unavailable.'

export const getStaticProps: GetStaticProps<Props> = async () => {
  const ogimage = await MakeOgImage(`${title}: ${desc}`, '404')
  return {
    props: {
      ogimage,
    },
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

const Notfound: NextPage<Props> = ({ ogimage }) => {
  return (
    <>
      <Hed title={title} desc={desc} ogimage={ogimage} />
      <header className="grider category-header">
        <span></span>
        <div>
          <h1>{title}</h1>
          <p>{desc}</p>
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
            <Link className="to-home neumorphism-h" href="/">
              Go back to 🏠
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}

export default Notfound
