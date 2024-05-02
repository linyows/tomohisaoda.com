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
} from 'rotion'

import {
  List,
  Page,
  Link as NLink,
} from 'rotion/ui'

import Hed from '../components/hed'
import GenFeed from '../src/lib/feed'
import { MakeOgImage } from '../src/lib/ogimage'
import Styles from '../styles/Home.module.css'

type Props = {
  aboutPage: GetPageResponseEx
  about: ListBlockChildrenResponseEx
  project: QueryDatabaseResponseEx
  blog: QueryDatabaseResponseEx
  activity: QueryDatabaseResponseEx
  ogimage: string
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const page_id = process.env.NOTION_INTRO_PAGE_ID as string
  const block_id = process.env.NOTION_INTRO_PAGE_ID as string
  const aboutPage = await FetchPage({ page_id })
  const about = await FetchBlocks({ block_id, last_edited_time: aboutPage.last_edited_time })

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
  const ogimage = await MakeOgImage('', 'home')

  return {
    props: {
      about,
      aboutPage,
      project,
      blog,
      activity,
      ogimage,
    },
    // ISR
    //revalidate: 10
  }
}

const Home: NextPage<Props> = ({ aboutPage, about, project, blog, activity, ogimage }) => {
  return (
    <>
      <Hed ogimage={ogimage} path="/" />
      <section className={`${Styles.section} ${Styles.about} grider`}>
        <div className={Styles.portrait}>
          <img className={Styles.icon} src={aboutPage.icon!.src} alt="tomohisaoda" />
        </div>
        <div className={Styles.aboutBody}>
          <Page blocks={about} />
          <div className={Styles.aboutFooter}>
            <Link className={`flat-button ${Styles.toContact}`} href="/contact">
              Contact
            </Link>
          </div>
        </div>
      </section>

      <section className={`${Styles.section} grider`}>
        <h2 className={Styles.title}><span className="neumorphism-h">Projects</span></h2>
        <div className={Styles.recent}>
          <List
            keys={['Name', 'Description', 'dashed', 'URL', 'Tags', 'Date']}
            db={project}
            href={'/projects/[Slug]'}
            link={Link as NLink}
          />
          <p className={Styles.viewall}>
            <Link className={`flat-button ${Styles.viewallButton}`} href="/projects">
              View all
            </Link>
          </p>
        </div>
      </section>

      <section className={`${Styles.section} grider`}>
        <h2 className={Styles.title}><span className="neumorphism-h">Blog</span></h2>
        <div className={Styles.recent}>
          <List
            keys={['Name', 'dashed', 'Tags', 'Date']}
            db={blog}
            href={'/blog/[Slug]'}
            link={Link as NLink}
          />
          <p className={Styles.viewall}>
            <Link className={`flat-button ${Styles.viewallButton}`} href="/blog">
              View all
            </Link>
          </p>
        </div>
      </section>

      <section className={`${Styles.section} grider`}>
        <h2 className={Styles.title}><span className="neumorphism-h">Activities</span></h2>
        <div className={Styles.recent}>
          <List
            keys={['Name', 'dashed', 'URL', 'Tags', 'Date']}
            db={activity}
            href={'/activities/[id]'}
            link={Link as NLink}
          />
          <p className={Styles.viewall}>
            <Link className={`flat-button ${Styles.viewallButton}`}href="/activities">
              View all
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}

export default Home
