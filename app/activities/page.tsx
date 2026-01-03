import type { Metadata } from "next";
import { GetActivities } from "../lib/activity";
import { generatePageMetadata } from "../lib/metadata";
import { MakeOgImage } from "../lib/ogimage";
import ActivityList from "./components/activity-list";

const title = "Activities";
const desc =
  "I will write about the presentation materials and interview articles.";

export async function generateMetadata(): Promise<Metadata> {
  const ogimage = await MakeOgImage(`${title}: ${desc}`, "activities");
  return generatePageMetadata({ title, desc, ogimage, path: "/activities" });
}

export default async function ActivityIndex() {
  const pages = await GetActivities();

  return <ActivityList pages={pages} title={title} desc={desc} />;
}
