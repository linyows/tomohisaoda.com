import fs from "node:fs";
import { Feed, type Item } from "feed";
import { FetchBlocks } from "rotion";
import { Page } from "rotion/ui";
import { GetBlogs } from "./blog";

//import * as ReactDOMServer from 'react-dom/server'
var ReactDOMServer = require("react-dom/server");

export default async function GenFeed() {
	const url = "https://tomohisaoda.com";
	const name = `Tomohisa Oda`;
	const email = `linyows@gmail.com`;
	const link = `https://twitter.com/linyows`;
	const description = `Software engineer, product designer, living in Fukuoka.`;
	const author = { name, email, link };

	const blogs = await GetBlogs();
	const date = new Date();

	const feed = new Feed({
		title: name,
		description,
		id: url,
		link: url,
		//image: `${url}/favicon.ico`,
		//favicon: `${url}/favicon.ico`,
		copyright: `${date.getFullYear()} ${name}, All rights reserved.`,
		updated: date,
		generator: "Feed",
		feedLinks: {
			rss2: `${url}/index.xml`,
		},
		author,
	});

	const items: Item[] = [];

	await Promise.all(
		blogs.map(async (v) => {
			const blocks = await FetchBlocks({
				block_id: v.id,
				last_edited_time: v.lastEditedTime,
			});
			const html = ReactDOMServer.renderToString(Page({ blocks }));
			const link = `${url}/blog/${v.slug}`;

			items.push({
				title: v.title,
				id: link,
				link,
				content: html.replaceAll(/\n/gi, " "),
				author: [author],
				contributor: [author],
				date: new Date(v.date),
			});
		}),
	);

	items.sort((a: Item, b: Item) => {
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	});

	for (const item of items) {
		feed.addItem(item);
	}

	fs.mkdirSync("./public/rss", { recursive: true });
	fs.writeFileSync("./public/index.xml", feed.rss2());
	//fs.writeFileSync('./public/index.json', feed.json1())
}
