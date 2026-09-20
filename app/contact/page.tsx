import type { Metadata } from "next";
import { FetchBlocks } from "rotion";
import { generatePageMetadata } from "../lib/metadata";
import { GetLastEditedTime } from "../lib/notion";
import { MakeOgImage } from "../lib/ogimage";
import ContactForm from "./components/contact-form";

const title = "Contact";
const desc = "Say Hello";

export async function generateMetadata(): Promise<Metadata> {
  const ogimage = await MakeOgImage(`${title}`, `contact`);
  return generatePageMetadata({ title, desc, ogimage, path: "/contact" });
}

export default async function Contact() {
  const block_id = process.env.NOTION_CONTACT_PAGE_ID as string;
  const contact = await FetchBlocks({
    block_id,
    last_edited_time: await GetLastEditedTime(block_id),
  });

  return <ContactForm contact={contact} title={title} desc={desc} />;
}
