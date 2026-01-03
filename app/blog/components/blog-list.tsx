"use client";

import Link from "next/link";
import Hed from "../../components/hed";
import { UsePagination } from "../../components/rotion-wrappers";
import type { Blog } from "../../lib/blog";

type Props = {
  pages: Blog[];
  ogimage: string;
  title: string;
  desc: string;
};

export default function BlogList({ pages, ogimage, title, desc }: Props) {
  const { next, currentPage, currentData, maxPage } = UsePagination<Blog>(
    pages,
    10,
  );
  const currentPosts = currentData();

  return (
    <div className="page-list">
      <Hed title={title} desc={desc} ogimage={ogimage} path="/blog" />
      <header className="grider page-list-header">
        <span></span>
        <div>
          <h1>{title}</h1>
          <p>{desc}</p>
        </div>
      </header>

      <div className="page-list-body">
        {currentPosts?.map((v, _i) => (
          <section key={`${v.title}-content`} className="post grider">
            <p className="post-date">
              <span className="post-date-inner">{v.date}</span>
            </p>
            <div>
              <h2 className="post-title gradation-text">
                <Link href="/blog/[slug]" as={`/blog/${v.slug}`}>
                  {v.title}
                </Link>
              </h2>
              {v.tags.length > 0 && (
                <ul className="post-tags">
                  {v.tags.map((tag) => (
                    <li key={`${v.title}-${tag}`}>{tag}</li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ))}

        <div className="grider">
          <span></span>
          <div className="content-loader">
            {currentPage !== maxPage ? (
              <button type="button" onClick={next} className="neumorphism-h">
                Load More
              </button>
            ) : (
              <p className="no-content">No more posts available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
