import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { FetchBlocks, type ListBlockChildrenResponseEx } from "rotion";
import { Page } from "rotion/ui";
import Hed from "../../components/hed";
import { type Activity, GetActivity, GetPaths } from "../../src/lib/activity";
import { MakeOgImage } from "../../src/lib/ogimage";

type Props = {
	page?: Activity;
	blocks?: ListBlockChildrenResponseEx;
	ogimage?: string;
};

type Params = {
	id: string;
};

export const getStaticPaths = async () => {
	const paths = await GetPaths();
	return {
		paths,
		fallback: false,
	};
};

export const getStaticProps: GetStaticProps<Props, Params> = async ({
	params,
}) => {
	if (!params?.id) {
		return {
			notFound: true,
		};
	}

	const page = await GetActivity(params.id);
	if (page) {
		const blocks = await FetchBlocks({
			block_id: page.id,
			last_edited_time: page.lastEditedTime,
		});
		const ogimage = await MakeOgImage(page.title, `activities-${page.id}`);
		return {
			props: {
				page,
				blocks,
				ogimage,
			},
		};
	}

	return {
		notFound: true,
	};
};

const ActivityPage: NextPage<Props> = (context) => {
	if (!context.page || !context.blocks) {
		return null;
	}
	const page = context.page;
	const blocks = context.blocks;
	return (
		<article className="grider page-detail activity">
			<Hed
				title={page.title}
				desc=""
				ogimage={context.ogimage}
				path={`/activities/${page.id}`}
			/>
			<div className="post-meta">
				<p className="post-date">
					Posted: <span className="post-meta-inner">{page.date}</span>
				</p>
				<p className="post-edited">
					Edited: <span className="post-meta-inner">{page.edited}</span>
				</p>
				{page.tags.length > 0 && (
					<p className="post-tags">
						Tags:
						{page.tags.map((tag) => (
							<span key={`${page.title}-${tag}`}>{tag}</span>
						))}
					</p>
				)}
			</div>
			<div>
				<h1 className="post-title gradation-text">
					<Link href="/activities/[id]" as={`/activities/${page.id}`}>
						{page.title}
					</Link>
				</h1>

				<dl className="dl">
					<dt>Authors</dt>
					<dd>{page.authors}</dd>
					<dt>Host</dt>
					<dd>{page.host}</dd>
					<dt>URL</dt>
					<dd>
						{" "}
						<a href={page.url} rel="noreferrer" target="_blank">
							{page.url}
						</a>{" "}
					</dd>
				</dl>

				<div className="post-body">
					<Page blocks={blocks} />
				</div>
			</div>
		</article>
	);
};

export default ActivityPage;
