import fs from 'fs'
import { Feed } from 'feed'
import { FetchBlocks } from 'notionate'
import { GetBlogs } from './blog'
import { Blocks } from 'notionate/dist/components'
//import * as ReactDOMServer from 'react-dom/server'
var ReactDOMServer = require('react-dom/server')

export default async function GenFeed() {
  const url = 'https://tomohisaoda.com'
  const name = `Tomohisa Oda`
  const email = `linyows@gmail.com`
  const link = `https://twitter.com/linyows`
  const description = `Software engineer, product designer, living in Fukuoka.`
  const author = { name, email, link }

  const blogs = await GetBlogs()
  const date = new Date()

  const feed = new Feed({
    title: name,
    description,
    id: url,
    link: url,
    image: `${url}/favicon.ico`,
    favicon: `${url}/favicon.ico`,
    copyright: `${date.getFullYear()} ${name}, All rights reserved.`,
    updated: date,
    generator: 'Feed',
    feedLinks: {
      rss2: `${url}/index.xml`,
    },
    author,
  })

  await Promise.all(
    blogs.map(async (v) => {
      const blocks = await FetchBlocks(v.id)
      const html = ReactDOMServer.renderToString(Blocks({ blocks }))
      const link = `${url}/blog/${v.slug}`

      feed.addItem({
        title: v.title,
        id: link,
        link,
        description: html,
        content: html,
        author: [author],
        contributor: [author],
        date: new Date(v.date),
      })
    }),
  )

  fs.mkdirSync('./public/rss', { recursive: true })
  fs.writeFileSync('./public/index.xml', feed.rss2())
  //fs.writeFileSync('./public/index.json', feed.json1())
}