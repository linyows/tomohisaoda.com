---
title: 'Tomohisa Oda'
layout: 'default'
---

ul class: 'posts',  ->
  for document in @documents
    if 0 is document.url.indexOf '/posts'
      li ->
        p class: 'date', ->
          span class: 'inner', ->
            text "#{document.tags}"
        p class: 'body', ->
          a href: document.url, property: 'dc:title', "#{document.title}"
          span class: 'meta', ->
            text @tool.moment(document.date).format('MMMM D, YYYY')
