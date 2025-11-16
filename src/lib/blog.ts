import {
	type DateResponse,
	type DBPageBase,
	FetchDatabase,
	type QueryDatabaseParameters,
	type RichTextItemResponse,
	type SelectPropertyResponse,
} from "rotion";
import { FormatDateMdY } from "./date";

export type Blog = {
	id: string;
	title: string;
	date: string;
	edited: string;
	slug: string;
	createdTs: number;
	lastEditedTs: number;
	lastEditedTime: string;
	tags: string[];
};

export type DBPage = DBPageBase & {
	properties: {
		Name: {
			type: "title";
			title: Array<RichTextItemResponse>;
			id: string;
		};
		Slug: {
			type: "rich_text";
			rich_text: Array<RichTextItemResponse>;
			id: string;
		};
		Date: {
			type: "date";
			date: DateResponse | null;
			id: string;
		};
		Tags: {
			type: "multi_select";
			multi_select: Array<SelectPropertyResponse>;
			id: string;
		};
		Published: {
			type: "checkbox";
			checkbox: boolean;
			id: string;
		};
	};
};

const query = {
	database_id: process.env.NOTION_BLOG_DB_ID as string,
	filter: {
		property: "Published",
		checkbox: {
			equals: true,
		},
	},
	sorts: [
		{
			property: "Date",
			direction: "descending",
		},
	],
} as QueryDatabaseParameters;

const build = (page: DBPage): Blog => {
	const props = page.properties;
	return {
		id: page.id,
		title: props.Name.title.map((v) => v.plain_text).join(",") || "",
		slug: props.Slug.rich_text.map((v) => v.plain_text).join(",") || "",
		date: FormatDateMdY(props.Date.date?.start),
		edited: FormatDateMdY(page.last_edited_time),
		createdTs: Date.parse(page.created_time),
		lastEditedTs: Date.parse(page.last_edited_time),
		lastEditedTime: page.last_edited_time,
		tags: props.Tags.multi_select.map((v) => v.name) || [],
	};
};

export const GetBlog = async (slug: string): Promise<Blog | undefined> => {
	const db = await FetchDatabase(query);
	const page = db.results.find((v) => {
		const p = v as unknown as DBPage;
		return (
			p.properties.Slug.rich_text.map((v) => v.plain_text).join(",") === slug
		);
	});
	return page ? build(page as unknown as DBPage) : page;
};

export const GetBlogs = async (): Promise<Blog[]> => {
	const db = await FetchDatabase(query);
	return db.results.map((v) => {
		return build(v as unknown as DBPage);
	});
};

export const GetPaths = async () => {
	const db = await FetchDatabase(query);
	return db.results.map((v) => {
		const p = v as DBPage;
		const slug = p.properties.Slug.rich_text.map((v) => v.plain_text).join(",");
		return { params: { slug } };
	});
};
