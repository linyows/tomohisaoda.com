import {
  FetchDatabase,
  DBPageBase,
  RichTextItemResponse,
  DateResponse,
  SelectPropertyResponse,
  QueryDatabaseParameters,
  GetDatabaseResponseEx,
} from 'rotion'
import { FormatDateMdY } from './date'

export type Project = {
  id: string
  title: string
  date: string
  edited: string
  slug: string
  createdTs: number
  lastEditedTs: number
  tags: string[]
  desc: string
  url: string
  cover: string
}

export type DBPage = GetDatabaseResponseEx & {
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
    Description: {
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
  database_id: process.env.NOTION_PROJECT_DB_ID as string,
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

const build = (page: DBPage): Project => {
  const props = page.properties
  return {
    id: page.id,
    title: props.Name.title.map(v => v.plain_text).join(',') || '',
    slug: props.Slug.rich_text.map(v => v.plain_text).join(',') || '',
    date: FormatDateMdY(props.Date.date?.start),
    edited: FormatDateMdY(page.last_edited_time),
    createdTs: Date.parse(page.created_time),
    lastEditedTs: Date.parse(page.last_edited_time),
    tags: props.Tags.multi_select.map(v => v.name) || [],
    desc: props.Description.rich_text.map(v => v.plain_text).join(',') || '',
    url: props.URL.url as string,
    cover: page.cover?.src || '',
  }
}

export const GetProject = async (slug: string): Promise<Project | undefined> => {
  const db = await FetchDatabase(query)
  const page = db.results.find(v => {
    const p = v as DBPage
    return p.properties.Slug.rich_text.map(v => v.plain_text).join(',') === slug
  })
  return (page) ? build(page as DBPage) : page
}

export interface GroupedProjects {
  [key: string]: Project[]
}

export const GetProjects = async (): Promise<GroupedProjects> => {
  const { results } = await FetchDatabase(query)
  let res: GroupedProjects = {}

  for (const v of results) {
    const project = build(v as unknown as DBPage)
    const key = project.tags.shift() || ''
    if (!(key in res)) {
      res[key] = []
    }
    res[key].push(project)
  }

  return res
}

export const GetPaths = async () => {
  const db = await FetchDatabase(query)
  return db.results.map(v => {
    const p = v as DBPage
    const slug = p.properties.Slug.rich_text.map(v => v.plain_text).join(',')
    return { params: { slug } }
  })
}
