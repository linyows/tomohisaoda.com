"use client";

import Link from "next/link";
import { Page, type ListBlockChildrenResponseEx } from "../app/components/rotion-wrappers";

type BlogDetailProps = {
	type: "blog";
	title: string;
	slug: string;
	date: string;
	edited: string;
	tags: string[];
	blocks: ListBlockChildrenResponseEx;
};

type ProjectDetailProps = {
	type: "project";
	title: string;
	slug: string;
	date: string;
	edited: string;
	tags: string[];
	desc: string;
	url: string;
	blocks: ListBlockChildrenResponseEx;
};

type ActivityDetailProps = {
	type: "activity";
	title: string;
	id: string;
	date: string;
	edited: string;
	tags: string[];
	authors: string;
	host: string;
	url: string;
	blocks: ListBlockChildrenResponseEx;
};

type Props = BlogDetailProps | ProjectDetailProps | ActivityDetailProps;

export default function PageDetail(props: Props) {
	const { type, title, date, edited, tags, blocks } = props;

	const getHref = () => {
		if (type === "blog") return `/blog/${props.slug}`;
		if (type === "project") return `/projects/${props.slug}`;
		return `/activities/${props.id}`;
	};

	const getPathPattern = () => {
		if (type === "blog") return "/blog/[slug]";
		if (type === "project") return "/projects/[slug]";
		return "/activities/[id]";
	};

	return (
		<article className={`grider page-detail ${type}`}>
			<div className="post-meta">
				<p className="post-date">
					Posted: <span className="post-meta-inner">{date}</span>
				</p>
				<p className="post-edited">
					Edited: <span className="post-meta-inner">{edited}</span>
				</p>
				{tags.length > 0 && (
					<p className="post-tags">
						Tags:
						{tags.map((tag) => (
							<span key={`${title}-${tag}`}>{tag}</span>
						))}
					</p>
				)}
			</div>
			<div>
				<h1 className="post-title gradation-text">
					<Link href={getPathPattern()} as={getHref()}>
						{title}
					</Link>
				</h1>

				{type === "project" && (
					<dl className="dl">
						<dt>Description</dt>
						<dd>{props.desc}</dd>
						<dt>URL</dt>
						<dd>
							<a href={props.url} rel="noreferrer" target="_blank">
								{props.url}
							</a>
						</dd>
					</dl>
				)}

				{type === "activity" && (
					<dl className="dl">
						<dt>Authors</dt>
						<dd>{props.authors}</dd>
						<dt>Host</dt>
						<dd>{props.host}</dd>
						<dt>URL</dt>
						<dd>
							<a href={props.url} rel="noreferrer" target="_blank">
								{props.url}
							</a>
						</dd>
					</dl>
				)}

				<div className="post-body">
					<Page blocks={blocks} />
				</div>
			</div>
		</article>
	);
}
