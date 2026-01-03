import { FetchBlocks } from "rotion";
import { MakeOgImage } from "../lib/ogimage";
import ContactForm from "./components/contact-form";

const title = "Contact";
const desc = "Say Hello";

export default async function Contact() {
	const contact = await FetchBlocks({
		block_id: process.env.NOTION_CONTACT_PAGE_ID as string,
	});
	const ogimage = await MakeOgImage(`${title}`, `contact`);

	return <ContactForm contact={contact} ogimage={ogimage} title={title} desc={desc} />;
}
