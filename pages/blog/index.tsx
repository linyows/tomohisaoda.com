import { useRef, useState, useEffect } from 'react'
import type { GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
//import Image from 'next/image'
import { Blog, GetBlogs } from '../../src/lib/blog'
import { UsePagination } from 'notionate/dist/components'

type Props = {
  pages: Blog[]
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const pages = await GetBlogs()
  return {
    props: {
      pages,
    },
    revalidate: 10
  }
}

const PostIndex: NextPage<Props> = ({ pages }) => {
  const { next, currentPage, currentData, maxPage } = UsePagination<Blog>(pages, 10)
  const currentPosts = currentData()

  return (
    <div className="page-list">
      <header className="grider page-list-header">
        <span></span>
        <div>
          <h1>Blog</h1>
          <p>I will write about software development and engineering.</p>
        </div>
      </header>

      <div className="page-list-body">
        {currentPosts && currentPosts.map((v, i) => (
          <section key={`${v.title}-content`} className="post grider">
            <p className="post-date"><span className="post-date-inner">{v.date}</span></p>
            <div>
              <h3 className="post-title gradation-text">
                <Link href="/blog/[slug]" as={`/blog/${v.slug}`}>
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

      <style jsx>{`
      `}</style>
    </div>
  )
}

export default PostIndex
