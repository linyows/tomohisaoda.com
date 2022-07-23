import type { GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
//import Image from 'next/image'
import { Project, GetProjects } from '../../src/lib/project'

type Props = {
  pages: Project[]
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const pages = await GetProjects()
  return {
    props: {
      pages,
    },
    revalidate: 10
  }
}

const ProjectIndex: NextPage<Props> = ({ pages }) => {
  return (
    <div className="page-list">
      <header className="grider page-list-header">
        <span></span>
        <div>
          <h1>Project</h1>
          <p>These are software engineering projects with me and my colleagues.</p>
        </div>
      </header>

      <div className="page-list-body">
        {pages.map((v, i) => (
          <section key={`${v.title}-content`} className="post grider">
            <p className="post-date"><span className="post-date-inner">{v.date}</span></p>
            <div>
              <h3 className="post-title gradation-text"> <Link href="/projects/[slug]" as={`/projects/${v.slug}`}>{v.title}</Link> </h3>
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
      <style jsx>{`
      `}</style>
    </div>
  )
}

export default ProjectIndex
