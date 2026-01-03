import { FetchBlocks } from "rotion";
import { notFound } from "next/navigation";
import PageDetail from "../../../components/page-detail";
import { MakeOgImage } from "../../lib/ogimage";
import { GetPaths, GetProject } from "../../lib/project";

type Params = {
	slug: string;
};

export async function generateStaticParams() {
	const paths = await GetPaths();
	return paths.map((path) => ({
		slug: path.params.slug,
	}));
}

export default async function ProjectPage({
	params,
}: { params: Promise<Params> }) {
	const { slug } = await params;
	const page = await GetProject(slug);

	if (!page) {
		notFound();
	}

	const blocks = await FetchBlocks({
		block_id: page.id,
		last_edited_time: page.lastEditedTime,
	});
	const ogimage = await MakeOgImage(page.title, `projects-${page.slug}`);

	return (
		<PageDetail
			type="project"
			title={page.title}
			slug={page.slug}
			date={page.date}
			edited={page.edited}
			tags={page.tags}
			desc={page.desc}
			url={page.url}
			blocks={blocks}
		/>
	);
}
