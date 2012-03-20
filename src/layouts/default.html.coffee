---
title: 'Tomohisa Oda'
description: 'my blog site.'
author: 'Tomohisa Oda'
---

doctype 5
html lang: 'en', ->
  head ->
    comment 'meta'
    meta charset: 'utf-8'
    meta 'http-equiv': 'X-UA-Compatible', content: 'IE=edge,chrome=1'
    meta 'http-equiv': 'content-type', content: 'text/html; charset=utf-8'
    meta name: 'viewport', content: 'width=device-width, initial-scale=1'
    text @blocks.meta.join('')

    comment 'document'
    title @document.title
    meta name: 'description', content: @document.description or ''
    meta name: 'author', content: @document.author or ''

    comment 'styles'
    text @blocks.styles.join('')
    link rel: 'stylesheet', href: '/styles/style.css', media: 'screen, projection'
    link rel: 'stylesheet', href: '/styles/print.css', media: 'print'
    #link rel: 'stylesheet', href: '//fonts.googleapis.com/css?family=Raleway:100|Prata|Fanwood+Text|Snippet', media: 'screen, projection'

    link rel: 'alternate', type: 'application/atom+xml', title: "Atom", href: 'http://feeds.feedburner.com/TomohisaOda'

    comment 'analytics'
    script ->
      """
      var _gaq = _gaq || [];
      _gaq.push(['_setAccount', 'UA-328462-11']);
      _gaq.push(['_trackPageview']);
      (function() {
      var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
      ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
      })();
      """
  body ->
    header ->
      p class: 'greeting', 'hi! my name is tomohisa oda.'
      h1 class: 'site-name', ->
          a href: '/', 'Tomohisa Oda'
      #p class: 'site-description', 'is... web engineer, designer.'

    if @document.url == '/index.html'
      text @content
    else
      article ->
        text @content
        comment 'disqus'
        div id: 'disqus_thread'
        script ->
          """
          var disqus_shortname = 'tomohisaoda';
          var d = 'http://tomohisaoda.com';
          var disqus_identifier = d + '#{@document.url}';
          var disqus_url = d + '#{@document.url}';
          var disqus_script = 'embed.js';
          (function () {
            var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
            dsq.src = 'http://' + disqus_shortname + '.disqus.com/' + disqus_script;
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
          }());
          """
    if @document.url != '/index.html'
      div id: 'footer-nav', ->
        nav class: 'latest-posts', ->
          h3 'Latest posts'
          ul ->
            for document in @documents
              if document.url.indexOf('/posts') == 0
                a href: document.url, ->
                  li document.title
        div id: 'search', ->
          h3 'Search'
          form 'search', action: 'http://google.com/search', method: 'get', ->
            input type: 'hidden', name: 'q', value: 'site:tomohisaoda.com'
            input 'search-query', type: 'text', name: 'q', results: '0', placeholder: 'Search'

    footer ->
      p "copyright #{new Date().getFullYear()} &copy; tomohisa oda"
      p "This website was generated on #{@tool.moment(@site.date).format('MMM D, YYYY')}."

    comment 'scripts'
    text @blocks.scripts.join('')
    script src: '/vendor/jquery-1.7.1.js'
    script src: '/vendor/modernizr-2.0.6.js'
    script src: '/vendor/underscore-1.2.3.js'
    script src: '/vendor/backbone-0.5.3.js'
    script src: '/scripts/script.js'

    comment 'comment count'
    script ->
      """
      var disqus_shortname = 'tomohisaoda';
      (function () {
          var s = document.createElement('script'); s.async = true;
          s.type = 'text/javascript';
          s.src = 'http://' + disqus_shortname + '.disqus.com/count.js';
          (document.getElementsByTagName('HEAD')[0] || document.getElementsByTagName('BODY')[0]).appendChild(s);
      }());
      """
