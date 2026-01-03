import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FetchBlocks } from "rotion";
import PageDetail from "../../components/page-detail";
import { GetActivity, GetPaths } from "../../lib/activity";
import { generatePageMetadata } from "../../lib/metadata";
import { MakeOgImage } from "../../lib/ogimage";

type Params = {
  id: string;
};

export async function generateStaticParams() {
  const paths = await GetPaths();
  return paths.map((path) => ({
    id: path.params.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const page = await GetActivity(id);

  if (!page) {
    return generatePageMetadata({});
  }

  const ogimage = await MakeOgImage(page.title, `activities-${page.id}`);
  return generatePageMetadata({
    title: page.title,
    ogimage,
    path: `/activities/${page.id}`,
  });
}

export default async function ActivityPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const page = await GetActivity(id);

  if (!page) {
    notFound();
  }

  const blocks = await FetchBlocks({
    block_id: page.id,
    last_edited_time: page.lastEditedTime,
  });

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
