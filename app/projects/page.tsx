import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { generatePageMetadata } from "../lib/metadata";
import { MakeOgImage } from "../lib/ogimage";
import { GetProjects } from "../lib/project";
import Styles from "../styles/Project.module.css";

const title = "Project";
const desc =
  "These are software engineering projects with me and my colleagues.";

export async function generateMetadata(): Promise<Metadata> {
  const ogimage = await MakeOgImage(`${title}: ${desc}`, "projects");
  return generatePageMetadata({ title, desc, ogimage, path: "/projects" });
}

export default async function ProjectIndex() {
  const pages = await GetProjects();

  return (
    <div>
      <header className="grider page-list-header">
        <span></span>
        <div>
          <h1>{title}</h1>
          <p>{desc}</p>
        </div>
      </header>

      <div className={Styles.gallery}>
        {Object.keys(pages).map((key) => (
          <div key={key} className={Styles.groupedCards}>
            <div className={Styles.groupName}>
              <span className={`flat-button-light ${Styles.groupNameInner}`}>
                {key}
              </span>
            </div>
            <div className={Styles.cards}>
              {pages[key].map((v, _i) => (
                <section key={`${v.title}-content`} className={Styles.card}>
                  <div className={Styles.cardImage}>
                    <Link href="/projects/[slug]" as={`/projects/${v.slug}`}>
                      <Image src={v.cover} fill={true} alt={v.title} />
                    </Link>
                  </div>
                  <h2 className={Styles.cardTitle}>{v.title}</h2>
                  {v.tags.length > 0 && (
                    <ul className={Styles.tags}>
                      {v.tags.map((tag) => (
                        <li key={`${v.title}-${tag}`}>{tag}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
