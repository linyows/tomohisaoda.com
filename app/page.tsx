import type { Metadata } from "next";
import type { ListBlockChildrenResponseEx, PageObjectResponseEx } from "rotion";
import {
  FetchBlocks,
  FetchDatabase,
  type FetchDatabaseArgs,
  FetchPage,
} from "rotion";
import HomeContent from "./components/home-content";
import GenFeed from "./lib/feed";
import { generatePageMetadata } from "./lib/metadata";
import { MakeOgImage } from "./lib/ogimage";

export async function generateMetadata(): Promise<Metadata> {
  const ogimage = await MakeOgImage("", "home");
  return generatePageMetadata({ ogimage, path: "/" });
}

export default async function Home() {
  const page_id = process.env.NOTION_INTRO_PAGE_ID as string;
  const block_id = process.env.NOTION_INTRO_PAGE_ID as string;
  const aboutPage = await FetchPage({ page_id }) as PageObjectResponseEx;
  const about = await FetchBlocks({
    block_id,
    last_edited_time: aboutPage.last_edited_time,
  }) as ListBlockChildrenResponseEx;

  const project = await FetchDatabase({
    database_id: process.env.NOTION_PROJECT_DB_ID as string,
    filter: { property: "Published", checkbox: { equals: true } },
    sorts: [{ property: "Date", direction: "descending" }],
    page_size: 5,
  } as FetchDatabaseArgs);

  const blog = await FetchDatabase({
    database_id: process.env.NOTION_BLOG_DB_ID as string,
    filter: { property: "Published", checkbox: { equals: true } },
    sorts: [{ property: "Date", direction: "descending" }],
    page_size: 7,
  } as FetchDatabaseArgs);

  const activity = await FetchDatabase({
    database_id: process.env.NOTION_ACTIVITY_DB_ID as string,
    filter: { property: "Published", checkbox: { equals: true } },
    sorts: [{ property: "Date", direction: "descending" }],
    page_size: 15,
  } as FetchDatabaseArgs);

  const workout = await FetchDatabase({
    database_id: process.env.NOTION_WEIGHTTRAINING_DB_ID as string,
    sorts: [{ property: "Date", direction: "descending" }],
    page_size: 7,
  } as FetchDatabaseArgs);

  await GenFeed();

  return (
    <HomeContent
      aboutPage={aboutPage}
      about={about}
      project={project}
      blog={blog}
      activity={activity}
      workout={workout}
    />
  );
}
