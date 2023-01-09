import { ReactElement } from 'react'
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
  Link as NLink,
} from 'notionate'
import {
  List,
  Blocks,
} from 'notionate/dist/components'
import Hed from '../components/hed'
import GenFeed from '../src/lib/feed'
import Styles from '../styles/Home.module.css'

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
    page_size: 5,
  } as QueryDatabaseParameters)
  
  const blog = await FetchDatabase({
    database_id: process.env.NOTION_BLOG_DB_ID as string,
    filter: { property: 'Published', checkbox: { equals: true }, },
    sorts: [ { property: 'Date', direction: 'descending' }, ],
    page_size: 7,
  } as QueryDatabaseParameters) 

  const activity = await FetchDatabase({
    database_id: process.env.NOTION_ACTIVITY_DB_ID as string,
    filter: { property: 'Published', checkbox: { equals: true }, },
    sorts: [ { property: 'Date', direction: 'descending' }, ],
    page_size: 15,
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
      <Hed />
      <section className={`${Styles.section} ${Styles.about} grider`}>
        <div className={Styles.portrait}>
          <img className={Styles.icon} src={aboutPage.icon.src} alt="tomohisaoda" />
        </div>
        <div className={Styles.aboutBody}>
          <Blocks blocks={about} />
          <div className={Styles.aboutFooter}>
            <Link className={`flat-button ${Styles.toContact}`} href="/contact">
              Contact <span role="img" aria-label="contact">🤙</span>
            </Link>
          </div>
        </div>
      </section>

      <section className={`${Styles.section} grider`}>
        <h2 className={Styles.title}><span className="neumorphism-h">Projects</span></h2>
        <div className={Styles.recent}>
          <List
            keys={['Name', 'Description', 'spacer', 'URL', 'Tags', 'Date']}
            db={project}
            href={'/projects/[Slug]'}
            link={Link as NLink}
          />
          <p className={Styles.viewall}>
            <Link className={`flat-button ${Styles.viewallButton}`} href="/projects">
              View all <span role="img" aria-label="home">🎪</span>
            </Link>
          </p>
        </div>
      </section>

      <section className={`${Styles.section} grider`}>
        <h2 className={Styles.title}><span className="neumorphism-h">Blog</span></h2>
        <div className={Styles.recent}>
          <List
            keys={['Name', 'spacer', 'Tags', 'Date']}
            db={blog}
            href={'/blog/[Slug]'}
            link={Link as NLink}
          />
          <p className={Styles.viewall}>
            <Link className={`flat-button ${Styles.viewallButton}`} href="/blog">
              View all <span role="img" aria-label="surf">🏄‍♂️</span>
            </Link>
          </p>
        </div>
      </section>

      <section className={`${Styles.section} grider`}>
        <h2 className={Styles.title}><span className="neumorphism-h">Activities</span></h2>
        <div className={Styles.recent}>
          <List
            keys={['Name', 'spacer', 'URL', 'Tags', 'Date']}
            db={activity}
            href={'/activities/[id]'}
            link={Link as NLink}
          />
          <p className={Styles.viewall}>
            <Link className={`flat-button ${Styles.viewallButton}`}href="/activities">
              View all <span role="img" aria-label="bike">🚴‍♂️</span>
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}

export default Home
