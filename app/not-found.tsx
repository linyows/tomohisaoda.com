import type { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata } from "./lib/metadata";
import { MakeOgImage } from "./lib/ogimage";

const title = "404";
const desc = "Looks like this page is unavailable.";

const asciiart = `
         ,
       _=|_
     _[_## ]_
_  +[_[_+_]P/    _    |_       ____      _=--|-~
 ~---_I_I_[=--~ ~~--[o]--==-|##==]-=-~~  o]H
-~ /[_[_|_]_]\\  -_  [[=]]    |====]  __  !j]H
  /    "|"          ^U-U^  - |    - ~ .~  U/~
 ~~--__~~~--__~~-__   H_H_    |_     --   _H_
-. _  ~~~#######~~~     ~~~-    ~~--  ._ - ~~-=
           ~~~=~~  -~~--  _     . -      _ _ -

       ----------------------------------
      |        June, 20th, 1969          |
      |  Here Men from the Planet Earth  |
      |   First set Foot upon the Moon   |
      | We came in Peace for all Mankind |
       ---------------------------=apx=--

`;

export async function generateMetadata(): Promise<Metadata> {
  const ogimage = await MakeOgImage(`${title}: ${desc}`, "404");
  return generatePageMetadata({ title, desc, ogimage, path: "/404" });
}

export default async function NotFound() {
  return (
    <>
      <header className="grider page-list-header">
        <span></span>
        <div>
          <h1>{title}</h1>
          <p>{desc}</p>
        </div>
      </header>

      <section className="grider">
        <span></span>
        <div>
          <pre className="asciiart">
            <code>{asciiart}</code>
          </pre>
          <p className="home">
            <Link className="to-home neumorphism-h" href="/">
              Go back to Home
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
