import { GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
import { FetchBlocks, ListBlockChildrenResponseEx } from 'notionate'
import { Blocks } from 'notionate/dist/components'
import { Activity, GetActivity, GetPaths } from '../../src/lib/activity'

type Props = {
  page?: Activity
  blocks?: ListBlockChildrenResponseEx
}

type Params = {
  id: string
}

export const getStaticPaths = async () => {
  const paths = await GetPaths()
  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<Props, Params> = async ({ params }) => {
  const page = await GetActivity(params!.id)
  if (page) {
    const blocks = await FetchBlocks(page.id)
    return {
      props: {
        page,
        blocks,
      },
      revalidate: 60,
    }
  }

  return {
    props: {},
    redirect: {
      destination: '/404'
    }
  }
}

const Activity: NextPage<Props> = (context) => {
  const page = context.page!
  const blocks = context.blocks!
  return (
    <article className="grider page-detail">
      <div className="post-meta">
        <p className="post-date">Posted: <span className="post-meta-inner">{page.date}</span></p>
        <p className="post-edited">Edited: <span className="post-meta-inner">{page.edited}</span></p>
        {page.tags.length > 0 &&
          <p className="post-tags">Tags:
            {page.tags.map(tag => (
              <span key={`${page.title}-${tag}`}>{tag}</span>
            ))}
          </p>
        }
      </div>
      <div>
        <h1 className="post-title gradation-text">
          <Link href="/activities/[id]" as={`/${page.id}`}>
            <a>{page.title}</a>
          </Link>
        </h1>

        <dl className="dl">
          <dt>Authors</dt>
          <dd>{page.authors}</dd>
          <dt>Host</dt>
          <dd>{page.host}</dd>
          <dt>URL</dt>
          <dd> <a href={page.url} rel="noreferrer" target="_blank">{page.url}</a> </dd>
        </dl>

        <div className="post-body">
          {Blocks({ blocks })}
        </div>
      </div>

      <style jsx>{`
      `}</style>
    </article>
  )
}

export default Activity
