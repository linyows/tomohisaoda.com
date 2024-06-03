import {
  FetchDatabase,
  DBPageBase,
  RichTextItemResponse,
  DateResponse,
  SelectPropertyResponse,
  QueryDatabaseParameters,
} from 'rotion'
import { FormatDateMdY } from './date'

export type Activity = {
  id: string
  title: string
  date: string
  edited: string
  slug: string
  createdTs: number
  lastEditedTs: number
  lastEditedTime: string
  tags: string[]
  host: string
  authors: string
  url: string
}

type DBPage = DBPageBase & {
  properties: {
    Name: {
      type: "title"
      title: Array<RichTextItemResponse>
      id: string
    }
    Slug: {
      type: "rich_text"
      rich_text: Array<RichTextItemResponse>
      id: string
    }
    Date: {
      type: "date"
      date: DateResponse | null
      id: string
    }
    Tags: {
      type: "multi_select"
      multi_select: Array<SelectPropertyResponse>
      id: string
    }
    Host: {
      type: "rich_text"
      rich_text: Array<RichTextItemResponse>
      id: string
    }
    Authors: {
      type: "rich_text"
      rich_text: Array<RichTextItemResponse>
      id: string
    }
    URL: {
      type: "url"
      url: string | null
      id: string
    }
    Published: {
      type: "checkbox"
      checkbox: boolean
      id: string
    }
  }
}

const query = {
  database_id: process.env.NOTION_ACTIVITY_DB_ID as string,
  filter: {
    property: 'Published',
    checkbox: {
      equals: true
    },
  },
  sorts: [
    {
      property: 'Date',
      direction: 'descending'
    },
  ]
} as QueryDatabaseParameters

const build = (page: DBPage): Activity => {
  const props = page.properties
  return {
    id: page.id,
    title: props.Name.title.map(v => v.plain_text).join(',') || '',
    slug: page.id,
    date: FormatDateMdY(props.Date.date?.start),
    edited: FormatDateMdY(page.last_edited_time),
    createdTs: Date.parse(page.created_time),
    lastEditedTs: Date.parse(page.last_edited_time),
    lastEditedTime: page.last_edited_time,
    tags: props.Tags.multi_select.map(v => v.name) || [],
    host: props.Host.rich_text.map(v => v.plain_text).join(',') || '',
    authors: props.Authors.rich_text.map(v => v.plain_text).join(',') || '',
    url: props.URL.url as string,
  }
}

export const GetActivity = async (id: string): Promise<Activity | undefined> => {
  const db = await FetchDatabase(query)
  const page = db.results.find(p => p.id === id)
  return (page) ? build(page as unknown as DBPage) : page
}

export const GetActivities = async (): Promise<Activity[]> => {
  const db = await FetchDatabase(query)
  return db.results.map(v => {
    return build(v as unknown as DBPage)
  })
}

export const GetPaths = async () => {
  const db = await FetchDatabase(query)
  return db.results.map(v => {
    return { params: { id: v.id } }
  })
}
