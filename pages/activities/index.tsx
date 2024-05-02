import type { GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
//import Image from 'next/image'
import { Activity, GetActivities } from '../../src/lib/activity'
import { UsePagination } from 'rotion/ui'
import Hed from '../../components/hed'
import { MakeOgImage } from '../../src/lib/ogimage'

type Props = {
  pages: Activity[]
  ogimage?: string
}

const title = 'Activities'
const desc = 'I will write about the presentation materials and interview articles.'

export const getStaticProps: GetStaticProps<Props> = async () => {
  const pages = await GetActivities()
  const ogimage = await MakeOgImage(`${title}: ${desc}`, 'activities')
  return {
    props: {
      pages,
    },
    revalidate: 10
  }
}

const ActivityIndex: NextPage<Props> = ({ pages, ogimage }) => {
  const { next, currentPage, currentData, maxPage } = UsePagination<Activity>(pages, 10)
  const currentPosts = currentData()

  return (
    <div className="page-list">
      <Hed title={title} desc={desc} ogimage={ogimage} path="/activities" />
      <header className="grider page-list-header">
        <span></span>
        <div>
          <h1>{title}</h1>
          <p>{desc}</p>
        </div>
      </header>

      <div className="page-list-body">
        {currentPosts && currentPosts.map((v, i) => (
          <section key={`${v.title}-content`} className="post grider">
            <p className="post-date"><span className="post-date-inner">{v.date}</span></p>
            <div>
              <h3 className="post-title gradation-text">
                <Link href="/activities/[id]" as={`/activities/${v.id}`}>
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

        <div className="grider">
          <span></span>
          <div className="content-loader">
          {currentPage !== maxPage ? (
            <button onClick={next} className="neumorphism-h">
              👆 Load More
            </button>
          ) : (
            <p className="no-content">No more posts available</p>
          )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActivityIndex
