import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FetchBlocks } from "rotion";
import PageDetail from "../../components/page-detail";
import { GetBlog, GetPaths } from "../../lib/blog";
import { generatePageMetadata } from "../../lib/metadata";
import { MakeOgImage } from "../../lib/ogimage";

type Params = {
  slug: string;
};

export async function generateStaticParams() {
  const paths = await GetPaths();
  return paths.map((path) => ({
    slug: path.params.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await GetBlog(slug);

  if (!page) {
    return generatePageMetadata({});
  }

  const ogimage = await MakeOgImage(page.title, `blog-${page.slug}`);
  return generatePageMetadata({
    title: page.title,
    ogimage,
    path: `/blog/${page.slug}`,
  });
}

export default async function BlogPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const page = await GetBlog(slug);

  if (!page) {
    notFound();
  }

  const blocks = await FetchBlocks({
    block_id: page.id,
    last_edited_time: page.lastEditedTime,
  });

  return (
    <PageDetail
      type="blog"
      title={page.title}
      slug={page.slug}
      date={page.date}
      edited={page.edited}
      tags={page.tags}
      blocks={blocks}
    />
  );
}
