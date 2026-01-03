import { FetchBlocks } from "rotion";
import { notFound } from "next/navigation";
import PageDetail from "../../../components/page-detail";
import { GetActivity, GetPaths } from "../../../src/lib/activity";
import { MakeOgImage } from "../../../src/lib/ogimage";

type Params = {
	id: string;
};

export async function generateStaticParams() {
	const paths = await GetPaths();
	return paths.map((path) => ({
		id: path.params.id,
	}));
}

export default async function ActivityPage({
	params,
}: { params: Promise<Params> }) {
	const { id } = await params;
	const page = await GetActivity(id);

	if (!page) {
		notFound();
	}

	const blocks = await FetchBlocks({
		block_id: page.id,
		last_edited_time: page.lastEditedTime,
	});
	const ogimage = await MakeOgImage(page.title, `activities-${page.id}`);

	return (
		<PageDetail
			type="activity"
			title={page.title}
			id={page.id}
			date={page.date}
			edited={page.edited}
			tags={page.tags}
			authors={page.authors}
			host={page.host}
			url={page.url}
			blocks={blocks}
		/>
	);
}
