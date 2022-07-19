/** @type {import('next').NextConfig} */
const notion = require('notionate')

module.exports = {
  reactStrictMode: true,
  trailingSlash: true,
  build: {
    extend(c, ctx) {
      c.node = {
        fs: 'empty'
      }
    }
  },
  exportPathMap: async function(defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
    const paths = {
      '/': { page: '/' },
      '/projects': { page: '/projects' },
      '/activities': { page: '/activities' },
      '/blog': { page: '/blog' },
      '/contact': { page: '/contact' },
    }

    const projects = await notion.FetchDatabase(process.env.NOTION_PROJECT_DB_ID)
    projects.results.forEach(v => {
      const slug = v.properties.Slug.rich_text.map(vv => vv.text.content).join(',')
      paths[`/projects/${slug}`] = { page: '/projects/[slug]', query: { slug } }
    })

    const activities = await notion.FetchDatabase(process.env.NOTION_ACTIVITY_DB_ID)
    projects.results.forEach(v => {
      const id = v.id
      paths[`/activities/${id}`] = { page: '/activities/[id]', query: { id } }
    })

    const blog = await notion.FetchDatabase(process.env.NOTION_BLOG_DB_ID)
    blog.results.forEach(v => {
      const slug = v.properties.Slug.rich_text.map(vv => vv.text.content).join(',')
      paths[`/blog/${slug}`] = { page: '/blog/[slug]', query: { slug } }
    })

    return paths
  }
}
