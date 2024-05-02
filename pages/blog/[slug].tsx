import { GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
import { FetchBlocks, ListBlockChildrenResponseEx } from 'rotion'
import { Blog, GetBlog, GetPaths } from '../../src/lib/blog'
import { Page } from 'rotion/ui'
import Hed from '../../components/hed'
import { MakeOgImage } from '../../src/lib/ogimage'

type Props = {
  page?: Blog
  blocks?: ListBlockChildrenResponseEx
  ogimage?: string
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
    const blocks = await FetchBlocks({ block_id: page.id })
    const ogimage = await MakeOgImage(page!.title, `blog-${page!.slug}`)
    return {
      props: {
        page,
        blocks,
        ogimage,
      },
    }
  }

  return {
    props: {},
    redirect: {
      destination: '/404'
    }
  }
}

const BlogPage: NextPage<Props> = (context) => {
  const page = context.page!
  const blocks = context.blocks!
  return (
    <article className="grider page-detail blog">
      <Hed title={page.title} desc="" ogimage={context.ogimage} path={`/blog/${page.slug}`} />
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
          <Link href="/blog/[slug]" as={`/blog/${page.slug}`}>
            {page.title}
          </Link>
        </h1>
        <div className="post-body">
          <Page blocks={blocks} />
        </div>
      </div>
    </article>
  )
}

export default BlogPage
