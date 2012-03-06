---
title: 'Tomohisa Oda'
layout: 'default'
---

ul class: 'posts',  ->
  for document in @documents
    if 0 is document.url.indexOf '/posts'
      li ->
        p class: 'date', ->
          text @tool.moment(document.date).format('MMM D, YYYY')
        p class: 'title', ->
          a href: document.url, property: 'dc:title', "#{document.title}"
        p class: 'footer', ->
          text "posted in #{document.tags}"
