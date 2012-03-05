---
title: 'Tomohisa Oda'
description: 'my blog site.'
author: 'Tomohisa Oda'
---

doctype 5
html lang: 'en', ->
    head ->
        # Standard
        meta charset: 'utf-8'
        meta 'http-equiv': 'X-UA-Compatible', content: 'IE=edge,chrome=1'
        meta 'http-equiv': 'content-type', content: 'text/html; charset=utf-8'
        meta name: 'viewport', content: 'width=device-width, initial-scale=1'
        text @blocks.meta.join('')

        # Document
        title @document.title
        meta name: 'description', content: @document.description or ''
        meta name: 'author', content: @document.author or ''

        # Styles
        text @blocks.styles.join('')
        link rel: 'stylesheet', href: '/styles/style.css', media: 'screen, projection'
        link rel: 'stylesheet', href: '/styles/print.css', media: 'print'
        link rel: 'stylesheet', href: '//fonts.googleapis.com/css?family=Raleway:100|Prata|Fanwood+Text|Snippet', media: 'screen, projection'

        # Analytics
        script type: 'text/javascript', ->
            text 'var _gaq = _gaq || [];'
            text "_gaq.push(['_setAccount', 'UA-328462-11']);"
            text "_gaq.push(['_trackPageview']);"
            text "(function() {"
            text "var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;"
            text "ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';"
            text "var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);"
            text "})();"
    body ->
        header ->
            h1 class: 'site-name', ->
                span 'Tomohisa Oda'
            p class: 'site-description', '...web engineer, designer...'

        nav class: 'global', ->
            ul ->
                for document in @documents
                    if document.url.indexOf('/posts') == 0
                        a href: document.url, ->
                            li document.title

        article ->
            text @content

        footer ->
            p "copyright #{new Date().getFullYear()} &copy; tomohisa oda"
            p "This website was generated on #{@site.date.toIsoDateString()}."

        # Scripts
        text @blocks.scripts.join('')
        script src: '/vendor/jquery-1.7.1.js'
        script src: '/vendor/modernizr-2.0.6.js'
        script src: '/vendor/underscore-1.2.3.js'
        script src: '/vendor/backbone-0.5.3.js'
        script src: '/scripts/script.js'
