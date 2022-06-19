import type { GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
//import Image from 'next/image'
import {
  FetchBlocks,
  FetchDatabase,
  FetchPage,
  ListBlockChildrenResponseEx,
  GetPageResponseEx,
  QueryDatabaseResponse,
} from 'notionate'
import {
  Blocks,
  DBList,
} from 'notionate/dist/components'
//import Blocks from '../src/components/page/blocks'
//import DBList from '../src/components/db/list'

type Props = {
  about: ListBlockChildrenResponseEx
  aboutPage: GetPageResponseEx
  blog: QueryDatabaseResponse
  activity: QueryDatabaseResponse
  project: QueryDatabaseResponse
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const about = await FetchBlocks(process.env.NOTION_INTRO_PAGE_ID as string)
  const blog = await FetchDatabase(process.env.NOTION_BLOG_DB_ID as string)
  const activity = await FetchDatabase(process.env.NOTION_ACTIVITY_DB_ID as string)
  const project = await FetchDatabase(process.env.NOTION_PROJECT_DB_ID as string)
  const aboutPage = await FetchPage(process.env.NOTION_INTRO_PAGE_ID as string)

  return {
    props: {
      about,
      aboutPage,
      blog,
      activity,
      project,
    },
    revalidate: 10
  }
}

const Home: NextPage<Props> = ({ about, aboutPage, blog, activity, project }) => {
  return (
    <>
      <section className="about grider">
        <div className="portrait">
          <img src={aboutPage.icon.src} />
        </div>
        <div className="recently-box">
          {Blocks({ blocks: about })}
          <div className="about-footer">
            <Link href="/contact" passHref>
              <a className="to-contact">Contact</a>
            </Link>
          </div>
        </div>
      </section>

      <section className="blog grider">
        <h2><span className="neumorphism-h">Blog</span></h2>
        <div className="recently-box">
          {DBList({ keys: ['Name', 'spacer', 'Tags', 'Date'], db: blog })}
        </div>
      </section>

      <section className="project grider">
        <h2><span className="neumorphism-h">Projects</span></h2>
        <div className="recently-box">
          {DBList({ keys: ['Name', 'spacer', 'URL', 'Tags', 'Date'], db: project })}
        </div>
      </section>

      <section className="activity grider">
        <h2><span className="neumorphism-h">Activities</span></h2>
        <div className="recently-box">
          {DBList({ keys: ['Name', 'spacer', 'URL', 'Tags', 'Date'], db: activity })}
        </div>
      </section>

      <style jsx global>{`
        .about img {
          margin-top: var(--spacing-10);
          width: 160px;
          border-radius: 20px;
        }
      `}</style>
      <style jsx>{`
        hr {
          height: 1px;
        }
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
        .to-contact {
          font-size: var(--fontSize-1);
          text-decoration: none;
          display: inline-block;
          padding: var(--spacing-2) var(--spacing-8) var(--spacing-3);
          background: #e0e0e0;
          border-radius: 30px;
          font-family: var(--fontFamily-sans);
          color: #555;
        }
        .to-contact:hover {
          background: #fff;
          color: #000;
        }
      `}</style>
    </>
  )
}

export default Home
