import type { Metadata } from "next";
import { FetchBlocks } from "rotion";
import { generatePageMetadata } from "../lib/metadata";
import { MakeOgImage } from "../lib/ogimage";
import ContactForm from "./components/contact-form";

const title = "Contact";
const desc = "Say Hello";

export async function generateMetadata(): Promise<Metadata> {
  const ogimage = await MakeOgImage(`${title}`, `contact`);
  return generatePageMetadata({ title, desc, ogimage, path: "/contact" });
}

export default async function Contact() {
  const contact = await FetchBlocks({
    block_id: process.env.NOTION_CONTACT_PAGE_ID as string,
  });

  return <ContactForm contact={contact} title={title} desc={desc} />;
}
