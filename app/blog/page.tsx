import type { Metadata } from "next";
import { GetBlogs } from "../lib/blog";
import { generatePageMetadata } from "../lib/metadata";
import { MakeOgImage } from "../lib/ogimage";
import BlogList from "./components/blog-list";

const title = "Blog";
const desc = "I will write about software development and engineering.";

export async function generateMetadata(): Promise<Metadata> {
  const ogimage = await MakeOgImage(`${title}: ${desc}`, "blog");
  return generatePageMetadata({ title, desc, ogimage, path: "/blog" });
}

export default async function BlogIndex() {
  const pages = await GetBlogs();

  return <BlogList pages={pages} title={title} desc={desc} />;
}
