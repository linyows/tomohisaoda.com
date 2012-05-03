---
title: 'Tomohisa Oda'
description: 'my blog site.'
author: 'Tomohisa Oda'
email: 'linyows@gmail.com'
date: '2000-1-1'
---

render_content = (doc) ->
  rendered = doc.contentRenderedWithoutLayouts
  text "<![CDATA[ #{rendered} ]]>"
render_excerpt = (doc) ->
  rendered = doc.contentRenderedWithoutLayouts
  if rendered
    rendered = rendered.replace(/[\n|\r\n]/g, '').replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '')
    text rendered.substring(0, 160) + '...'

anEntry = (document) ->
  tag 'entry', ->
    title document.title
    tag 'link', href: document.url
    tag 'updated', document.date.toIsoDateString()
    tag 'id', document.url
    tag 'summary', type: 'html', -> render_excerpt(document)
    tag 'content', type: 'html', -> render_content(document)

text '<?xml version="1.0" encoding="utf-8"?>\n'
tag 'feed', xmlns: 'http://www.w3.org/2005/Atom', ->
  title @document.title
  tag 'link', href: "#{@site.url}/atom.xml", rel: 'self'
  tag 'link', href: @site.url
  tag 'updated', @site.date.toIsoDateString()
  tag 'id', @site.url
  tag 'author', ->
    tag 'name', @document.author
    tag 'email', @document.email

  i=0
  for document in @documents
    if 0 is document.url.indexOf '/posts'
      i++
      if i < 10
        anEntry document

