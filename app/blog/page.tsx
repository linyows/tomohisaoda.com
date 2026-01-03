import { GetBlogs } from "../lib/blog";
import { MakeOgImage } from "../lib/ogimage";
import BlogList from "./components/blog-list";

const title = "Blog";
const desc = "I will write about software development and engineering.";

export default async function BlogIndex() {
  const pages = await GetBlogs();
  const ogimage = await MakeOgImage(`${title}: ${desc}`, "blog");

  return <BlogList pages={pages} ogimage={ogimage} title={title} desc={desc} />;
}
