import { GetStaticPaths, GetStaticProps, NextPage, PreviewData } from 'next'
import Link from 'next/link'
import { FetchBlocks, ListBlockChildrenResponseEx } from 'rotion'
import { Page } from 'rotion/ui'
import { GetProject, Project, GetPaths } from '../../src/lib/project'
import { ParsedUrlQuery } from 'node:querystring'
import Hed from '../../components/hed'
import { MakeOgImage } from '../../src/lib/ogimage'

type Props = {
  page?: Project
  blocks?: ListBlockChildrenResponseEx
  ogimage?: string
}

type Params = ParsedUrlQuery & {
  slug: string
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const paths = await GetPaths()
  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<Props, Params> = async ({ params }) => {
  const page = await GetProject(params!.slug)

  if (page) {
    const blocks = await FetchBlocks({ block_id: page.id })
    const ogimage = await MakeOgImage(page!.title, `projects-${page!.slug}`)
    return {
      props: {
        page,
        blocks,
        ogimage,
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

const ProjectPage: NextPage<Props> = (context) => {
  const page = context.page!
  const blocks = context.blocks!
  return (
    <article className="grider page-detail project">
      <Hed title={page.title} desc={page.desc} ogimage={context.ogimage} path={`/projects/${page.slug}`} />
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
          <Link href="/projects/[slug]" as={`/projects/${page.slug}`}>
            {page.title}
          </Link>
        </h1>

        <dl className="dl">
          <dt>Description</dt>
          <dd>{page.desc}</dd>
          <dt>URL</dt>
          <dd> <a href={page.url} rel="noreferrer" target="_blank">{page.url}</a> </dd>
        </dl>

        <div className="post-body">
          <Page blocks={blocks} />
        </div>
      </div>
    </article>
  )
}

export default ProjectPage
