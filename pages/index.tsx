import type { GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
//import Image from 'next/image'
import {
  FetchBlocks,
  FetchDatabase,
  FetchPage,
  ListBlockChildrenResponseEx,
  GetPageResponseEx,
  QueryDatabaseResponseEx,
  QueryDatabaseParameters,
} from 'notionate'
import {
  DBList,
  Blocks,
} from 'notionate/dist/components'
import GenFeed from '../src/lib/feed'

type Props = {
  aboutPage: GetPageResponseEx
  about: ListBlockChildrenResponseEx
  project: QueryDatabaseResponseEx
  blog: QueryDatabaseResponseEx
  activity: QueryDatabaseResponseEx
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const about = await FetchBlocks(process.env.NOTION_INTRO_PAGE_ID as string)
  const aboutPage = await FetchPage(process.env.NOTION_INTRO_PAGE_ID as string)

  const project = await FetchDatabase({
    database_id: process.env.NOTION_PROJECT_DB_ID as string,
    filter: { property: 'Published', checkbox: { equals: true }, },
    sorts: [ { property: 'Date', direction: 'descending' }, ],
    limit: 5,
  } as QueryDatabaseParameters)
  
  const blog = await FetchDatabase({
    database_id: process.env.NOTION_BLOG_DB_ID as string,
    filter: { property: 'Published', checkbox: { equals: true }, },
    sorts: [ { property: 'Date', direction: 'descending' }, ],
    limit: 7,
  } as QueryDatabaseParameters) 

  const activity = await FetchDatabase({
    database_id: process.env.NOTION_ACTIVITY_DB_ID as string,
    filter: { property: 'Published', checkbox: { equals: true }, },
    sorts: [ { property: 'Date', direction: 'descending' }, ],
    limit: 15,
  } as QueryDatabaseParameters)

  await GenFeed()

  return {
    props: {
      about,
      aboutPage,
      project,
      blog,
      activity,
    },
    // ISR
    //revalidate: 10
  }
}

const Home: NextPage<Props> = ({ aboutPage, about, project, blog, activity }) => {
  return (
    <>
      <section className="about grider">
        <div className="portrait">
          <img src={aboutPage.icon.src} alt="tomohisaoda" />
        </div>
        <div className="recently-box">
          <Blocks blocks={about} />
          <div className="about-footer">
            <Link href="/contact">
              <a className="flat-button to-contact">Contact <span role="img" aria-label="contact">🤙</span></a>
            </Link>
          </div>
        </div>
      </section>

      <section className="project grider">
        <h2><span className="neumorphism-h">Projects</span></h2>
        <div className="recently-box">
          <DBList keys={['Name', 'Description', 'spacer', 'URL', 'Tags', 'Date']} db={project} link={'/projects/[Slug]'} LinkComp={Link} />
          <p className="view-all">
            <Link href="/projects">
              <a className="flat-button view-all-button">View all <span role="img" aria-label="home">🎪</span></a>
            </Link>
          </p>
        </div>
      </section>

      <section className="blog grider">
        <h2><span className="neumorphism-h">Blog</span></h2>
        <div className="recently-box">
          <DBList keys={['Name', 'spacer', 'Tags', 'Date']} db={blog} link={'/blog/[Slug]'} LinkComp={Link} />
          <p className="view-all">
            <Link href="/blog">
              <a className="flat-button view-all-button">View all <span role="img" aria-label="surf">🏄‍♂️</span></a>
            </Link>
          </p>
        </div>
      </section>

      <section className="activity grider">
        <h2><span className="neumorphism-h">Activities</span></h2>
        <div className="recently-box">
          <DBList keys={['Name', 'spacer', 'URL', 'Tags', 'Date']} db={activity} link={'/activities/[id]'} LinkComp={Link} />
          <p className="view-all">
            <Link href="/activities">
              <a className="flat-button view-all-button">View all <span role="img" aria-label="bike">🚴‍♂️</span></a>
            </Link>
          </p>
        </div>
      </section>

      <style jsx global>{`
        .about img {
          margin-top: var(--spacing-10);
          width: 160px;
          border-radius: 20px;
        }
        @media (max-width: 480px) {
          .about img {
            margin-top: 0;
          }
        }
      `}</style>
      <style jsx>{`
        section {
          padding: 0;
          max-width: var(--maxWidth-full);
          font-size: var(--fontSize-1);
          font-faimly: var(--fontFamily-sans);
        }
        h2 {
          text-align: right;
          font-size: var(--fontSize-0);
          display: inline;
        }
        .recently-box {
          margin: var(--spacing-12) auto var(--spacing-2);
          width: 100%;
        }
        .about {
          font-size: var(--fontSize-3);
          padding-top: var(--spacing-8);
          margin-bottom: var(--spacing-16);
        }
        .portrait {
          padding-top: var(--spacing-4);
        }
        .about-footer {
          text-align: right;
        }
        .to-contact {
          font-size: var(--fontSize-1);
          color: #555;
        }
        .view-all {
          text-align: right;
          margin: 0 0 var(--spacing-10);
        }
        .view-all-button {
          font-size: var(--fontSize-0);
          margin-top: var(--spacing-6);
          padding: var(--spacing-1) var(--spacing-8) var(--spacing-2);
          color: #555;
        }
        .view-all-button:hover {
          background: #fff;
          color: #000;
        }
        @media (max-width: 480px) {
          .about {
            font-size: var(--fontSize-2);
            padding-top: 0;
          }
        }
        @media (max-width: 1220px) {
          .about {
            margin-top: 0;
          }
          .portrait {
            padding-top: 0;
            padding-right: var(--spacing-8);
            float: left;
          }
        }
      `}</style>
    </>
  )
}

export default Home
