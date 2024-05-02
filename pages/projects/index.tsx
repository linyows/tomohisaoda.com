import type { GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
//import Image from 'next/image'
import { Project, GetProjects } from '../../src/lib/project'
import Hed from '../../components/hed'
import { MakeOgImage } from '../../src/lib/ogimage'

type Props = {
  pages: Project[]
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
    <div className="page-list">
      <Hed title={title} desc={desc} ogimage={ogimage} path="/projects" />
      <header className="grider page-list-header">
        <span></span>
        <div>
          <h1>{title}</h1>
          <p>{desc}</p>
        </div>
      </header>

      <div className="page-list-body">
        {pages.map((v, i) => (
          <section key={`${v.title}-content`} className="post grider">
            <p className="post-date">
              <span className="post-date-inner">
                {v.date}
              </span>
            </p>
            <div>
              <h3 className="post-title gradation-text">
                <Link href="/projects/[slug]" as={`/projects/${v.slug}`}>
                  {v.title}
                </Link>
              </h3>
              {v.tags.length > 0 &&
                <ul className="post-tags">
                  {v.tags.map(tag => (
                    <li key={`${v.title}-${tag}`}>{tag}</li>
                  ))}
                </ul>
              }
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

export default ProjectIndex
