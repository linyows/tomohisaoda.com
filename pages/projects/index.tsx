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
    <>
      <header className="grider category-header">
        <span></span>
        <div>
          <h1>Project</h1>
          <p>These are software engineering projects with me and my colleagues.</p>
        </div>
      </header>

      <div className="post-list">
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
        .post-list {
          padding-top: var(--spacing-5);
        }
        .post {
          padding: var(--spacing-5) var(--spacing-10) 0 0;
        }
        .post-title {
          margin: 0;
          padding: 0;
        }
        .post-date {
          font-family: var(--fontFamily-sans);
          font-size: var(--fontSize-0);
          text-align: right;
          margin-top: var(--spacing-1);
        }
        .post-date-inner {
          display: inline-block;
          padding: var(--spacing-1) var(--spacing-4);
          background: #e0e0e0;
          border-radius: 30px;
        }
        .post-tags {
          display: block;
          margin: 0;
          padding: var(--spacing-1);
        }
        .post-tags li {
          font-size: var(--fontSize-0);
          display: inline-block;
          padding-right: var(--spacing-3);
        }
      `}</style>
    </>
  )
}

export default ProjectIndex
