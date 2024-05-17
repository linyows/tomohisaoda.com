import type { GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { GroupedProjects, GetProjects } from '../../src/lib/project'
import Hed from '../../components/hed'
import { MakeOgImage } from '../../src/lib/ogimage'
import Styles from '../../styles/Project.module.css'

type Props = {
  pages: GroupedProjects
  ogimage: string
}

const title = 'Project'
const desc = 'These are software engineering projects with me and my colleagues.'

export const getStaticProps: GetStaticProps<Props> = async () => {
  const pages = await GetProjects()
  const ogimage = await MakeOgImage(`${title}: ${desc}`, `projects`)
  return {
    props: {
      pages,
      ogimage,
    },
  }
}

const ProjectIndex: NextPage<Props> = ({ pages, ogimage }) => {
  return (
    <div>
      <Hed title={title} desc={desc} ogimage={ogimage} path="/projects" />
      <header className="grider page-list-header">
        <span></span>
        <div>
          <h1>{title}</h1>
          <p>{desc}</p>
        </div>
      </header>

      <div className={Styles.gallery}>
        {Object.keys(pages).map(key => (
          <div key={key} className={Styles.groupedCards}>
            <div className={Styles.groupName}>
              <span className={Styles.groupNameInner}>
                {key}
              </span>
            </div>
            <div className={Styles.cards}>
              {pages[key].map((v, i) => (
                <section key={`${v.title}-content`} className={Styles.card}>
                  <div className={Styles.cardImage}>
                    <Link href="/projects/[slug]" as={`/projects/${v.slug}`}>
                      <Image src={v.cover} fill={true} alt={v.title} />
                    </Link>
                  </div>
                  <h2 className={Styles.cardTitle}>
                    {v.title}
                  </h2>
                  {v.tags.length > 0 &&
                    <ul className={Styles.tags}>
                      {v.tags.map(tag => (
                        <li key={`${v.title}-${tag}`}>{tag}</li>
                      ))}
                    </ul>
                  }
                </section>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProjectIndex
