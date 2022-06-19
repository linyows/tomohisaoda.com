import {
  FetchDatabase,
  DBPageBase,
  RichText,
  DateResponse,
  SelectPropertyResponse,
} from 'notionate'
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
}

export type DBPage = DBPageBase & {
  properties: {
    Name: {
      type: "title"
      title: Array<RichText>
      id: string
    }
    Slug: {
      type: "rich_text"
      rich_text: Array<RichText>
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
      rich_text: Array<RichText>
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

const dbId = process.env.NOTION_PROJECT_DB_ID as string

const build = (page: DBPage): Project => {
  const props = page.properties
  return {
    id: page.id,
    title: props.Name.title.map(v => v.text.content).join(',') || '',
    slug: props.Slug.rich_text.map(v => v.text.content).join(',') || '',
    date: FormatDateMdY(props.Date.date?.start),
    edited: FormatDateMdY(page.last_edited_time),
    createdTs: Date.parse(page.created_time),
    lastEditedTs: Date.parse(page.last_edited_time),
    tags: props.Tags.multi_select.map(v => v.name) || [],
    desc: props.Description.rich_text.map(v => v.text.content).join(',') || '',
    url: props.URL.url as string,
  }
}

export const GetProject = async (slug: string): Promise<Project | undefined> => {
  const db = await FetchDatabase(dbId)
  const page = db.results.find(v => {
    const p = v as unknown as DBPage
    return p.properties.Slug.rich_text.map(v => v.text.content).join(',') === slug
  })
  return (page) ? build(page as unknown as DBPage) : page
}

export const GetProjects = async (): Promise<Project[]> => {
  const db = await FetchDatabase(dbId)
  return db.results.map(v => {
    return build(v as unknown as DBPage)
  })
}

export const GetPaths = async () => {
  const db = await FetchDatabase(dbId)
  return db.results.map(v => {
    const p = v as DBPage
    const slug = p.properties.Slug.rich_text.map(v => v.text.content).join(',')
    return { params: { slug } }
  })
}
