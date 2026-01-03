import fs from "node:fs";
import { Feed, type Item } from "feed";
import { FetchBlocks, type ListBlockChildrenResponseEx } from "rotion";
import { GetBlogs } from "./blog";

function extractTextFromBlocks(blocks: ListBlockChildrenResponseEx): string {
  let text = "";

  for (const block of blocks.results) {
    if (!("type" in block)) continue;

    const blockType = block.type;
    let richTextArray: any[] = [];

    // Extract rich_text array from different block types
    if (blockType === "paragraph" && "paragraph" in block) {
      richTextArray = block.paragraph.rich_text;
    } else if (blockType === "heading_1" && "heading_1" in block) {
      richTextArray = block.heading_1.rich_text;
      text += "\n";
    } else if (blockType === "heading_2" && "heading_2" in block) {
      richTextArray = block.heading_2.rich_text;
      text += "\n";
    } else if (blockType === "heading_3" && "heading_3" in block) {
      richTextArray = block.heading_3.rich_text;
      text += "\n";
    } else if (
      blockType === "bulleted_list_item" &&
      "bulleted_list_item" in block
    ) {
      richTextArray = block.bulleted_list_item.rich_text;
      text += "• ";
    } else if (
      blockType === "numbered_list_item" &&
      "numbered_list_item" in block
    ) {
      richTextArray = block.numbered_list_item.rich_text;
      text += "- ";
    } else if (blockType === "quote" && "quote" in block) {
      richTextArray = block.quote.rich_text;
    } else if (blockType === "code" && "code" in block) {
      richTextArray = block.code.rich_text;
    } else if (blockType === "callout" && "callout" in block) {
      richTextArray = block.callout.rich_text;
    }

    // Extract text content from rich_text array
    for (const richText of richTextArray) {
      if ("text" in richText && richText.text) {
        text += richText.text.content;
      } else if ("plain_text" in richText) {
        text += richText.plain_text;
      }
    }

    if (richTextArray.length > 0) {
      text += "\n";
    }
  }

  return text.trim();
}

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
      const content = extractTextFromBlocks(blocks);
      const link = `${url}/blog/${v.slug}`;

      items.push({
        title: v.title,
        id: link,
        link,
        content: content.replaceAll(/\n/gi, " "),
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
