import type { GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
//import Image from 'next/image'
import { Activity, GetActivities } from '../../src/lib/activity'
import { UsePagination } from 'notionate/dist/components'

type Props = {
  pages: Activity[]
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const pages = await GetActivities()
  return {
    props: {
      pages,
    },
    revalidate: 10
  }
}

const ActivityIndex: NextPage<Props> = ({ pages }) => {
  const { next, currentPage, currentData, maxPage } = UsePagination<Activity>(pages, 10)
  const currentPosts = currentData()

  return (
    <>
      <header className="grider category-header">
        <span></span>
        <div>
          <h1>Activities</h1>
          <p>I will write about the presentation materials and interview articles.</p>
        </div>
      </header>

      <div className="post-list">
        {currentPosts && currentPosts.map((v, i) => (
          <section key={`${v.title}-content`} className="post grider">
            <p className="post-date"><span className="post-date-inner">{v.date}</span></p>
            <div>
              <h3 className="post-title gradation-text"> <Link href="/activities/[id]" as={`/activities/${v.id}`}>{v.title}</Link> </h3>
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
        .content-loader {
          margin-top: var(--spacing-10);
          font-family: var(--fontFamily-sans);
          font-size: var(--fontSize-0);
        }
        button {
          cursor: pointer;
        }
        .no-content {
          color: #aaa;
          margin: 0;
        }
      `}</style>
    </>
  )
}

export default ActivityIndex
