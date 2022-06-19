import { GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
import { FetchBlocks, ListBlockChildrenResponseEx } from 'notionate'
import { Blog, GetBlog, GetPaths } from '../../src/lib/blog'
import { Blocks } from 'notionate/dist/components'

type Props = {
  page?: Blog
  blocks?: ListBlockChildrenResponseEx
}

type Params = {
  slug: string
}

export const getStaticPaths = async () => {
  const paths = await GetPaths()
  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<Props, Params> = async ({ params }) => {
  const page = await GetBlog(params!.slug)
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

const Post: NextPage<Props> = (context) => {
  const page = context.page!
  const blocks = context.blocks!
  return (
    <>
      <article className="grider">
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
          <h1 className="post-title gradation-text"><Link href="/blog/[slug]" as={`/${page.slug}`}>{page.title}</Link></h1>
          <div className="post-body">
            {Blocks({ blocks })}
          </div>
        </div>
      </article>

      <style jsx>{`
        .post-meta {
          font-family: var(--fontFamily-sans);
          font-size: var(--fontSize-0);
          text-align: right;
          margin-top: var(--spacing-20);
          padding-top: var(--spacing-8);
          color: #BBB;
        }
        .post-title {
          margin: 0;
          padding: var(--spacing-8) 0;
        }
        .post-tags-title {
          margin-bottom: var(--spacing-2);
          display: inline;
        }
        .post-tags {
          list-style-type: none;
          padding: 0;
        }
        .post-tags span {
          display: inline-block;
          padding: var(--spacing-1) var(--spacing-4);
          color: #666;
        }
        .post-meta-inner {
          display: inline-block;
          padding: var(--spacing-1) var(--spacing-4);
          background: #e0e0e0;
          border-radius: 30px;
          color: #666;
        }
        .post-body {
          max-width: var(--maxWidth-4xl);
        }
      `}</style>
    </>
  )
}

export default Post
