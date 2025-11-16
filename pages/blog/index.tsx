import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { UsePagination } from "rotion/ui";
import Hed from "../../components/hed";
//import Image from 'next/image'
import { type Blog, GetBlogs } from "../../src/lib/blog";
import { MakeOgImage } from "../../src/lib/ogimage";

type Props = {
	pages: Blog[];
	ogimage: string;
};

const title = "Blog";
const desc = "I will write about software development and engineering.";

export const getStaticProps: GetStaticProps<Props> = async () => {
	const pages = await GetBlogs();
	const ogimage = await MakeOgImage(`${title}: ${desc}`, "blog");
	return {
		props: {
			pages,
			ogimage,
		},
	};
};

const PostIndex: NextPage<Props> = ({ pages, ogimage }) => {
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
				{currentPosts &&
					currentPosts.map((v, i) => (
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
							<button onClick={next} className="neumorphism-h">
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
};

export default PostIndex;
