import { Client } from "@notionhq/client";

let client: Client | undefined;

const notion = (): Client => {
  if (client === undefined) {
    client = new Client({ auth: process.env.NOTION_TOKEN });
  }
  return client;
};

/**
 * GetLastEditedTime asks Notion directly when a page was last edited.
 *
 * Rotion caches FetchPage and FetchBlocks under the page id alone, so with
 * ROTION_INCREMENTAL_CACHE they keep returning the cached copy unless they are
 * given a last_edited_time to compare it against. Pages that are reached by a
 * database query get one from the query, but pages addressed by id have no
 * such source. Returns undefined when the request fails, which leaves rotion
 * with its cache rather than failing the build.
 */
export const GetLastEditedTime = async (
  pageId: string,
): Promise<string | undefined> => {
  try {
    const page = await notion().pages.retrieve({ page_id: pageId });
    return "last_edited_time" in page ? page.last_edited_time : undefined;
  } catch (e) {
    console.warn(`failed to retrieve last_edited_time of ${pageId}: ${e}`);
    return undefined;
  }
};
