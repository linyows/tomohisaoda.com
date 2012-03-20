---
title: 'JekyllのNode版であるDocpadを使ってみる'
layout: 'default'
tags: ['javascript', 'docpad']
---

JekyllのNode版であるDocpadを使ってみる
======================================

なんか巷では、[jekyll](http://jekyllrb.com/), [octpress](http://octopress.org/) が流行っているっぽい。完全に乗り遅れたので、いや乗るつもりも無かったけど、[node](http://nodejs.org/)弄るのが比較的楽しいので、node.js版 jekyll の Docpadを使ってブログをはじめてみる。

 - Docpad https://github.com/bevry/docpad
 - Docpadを使ったサイト https://github.com/bevry/docpad/wiki/Showcase

Install
-------

docpadは、coffee-scriptで実装されていて、まずmacにcoffeeと一緒にインストールする。`-g`オプションはgloballyで`/usr/local/bin/*`にインストールする。

<pre>
$ npm install -g coffee-script docpad
</pre>

プロジェクト用のディレクトリに移動し、`run`コマンドではじめる。`run`コマンドは、全てのコマンドを実行してくれるみたいで、*2回目以降実行するとエラーが出る*。ドキュメントにある通り最初の1回用っぽい。

実行したらどのスケルトンを使うか聞かれるので選択する。Twitter's Bootstrap使うと*それ臭さがにじみ出てキモイ*ので、何もスタイル無しの状態を選択。

<pre>
$ docpad run
info: Welcome to DocPad v3.3.0
You are about to create your new project inside your current directory. Below is a list of skeletons to bootstrap your new project:

        canvas.docpad
        The Blank Canvas Skeleton for DocPad. Your web development playground.

        kitchensink.docpad
        Kitchensink Skeleton for DocPad, based off Twitter's Bootstrap

Which skeleton will you use?
  1) canvas.docpad
  2) kitchensink.docpad
  :
</pre>

すると必要なモジュールがインストールされて、サーバーが`localhost:9778`に起動する。記事書いて確認したりするには、`$ docpad cli`が*便利かも*。docpadのコマンドをそのまま叩ける状態になるので、`server`と`watch`を叩く事で更新をlocalhostで確認しやすい。

<pre>
$ docpad cli
info: Welcome to DocPad v3.3.0
What would you like to do now?
> server
info: DocPad listening to http://localhost:9778/ with directory /Users/foo/Projects/bar/out
info: The action completed successfully

What would you like to do now?
> watch
info: Watching setup starting...
info: Watching setup
info: The action completed successfully

What would you like to do now?
>
</pre>

こんな風に対話式にコマンドを叩ける。`watch`はファイルの更新を検知してずっとビルドしてくれる。

記事を書く
----------

以下は、ディレクトリ構成。

<pre>
├── README.md
├── node_modules
│   ├── coffee-script
│   ├── docpad
│   ├── express
│   ├── moment
│   └── underscore
├── out
│   ├── images
│   ├── index.html
│   ├── scripts
│   ├── styles
│   └── vendor
├── package.json
├── plugins
└── src
    ├── documents
    │   ├── index.html.coffee
    │   ├── posts
    │   ├── scripts
    │   └── styles
    ├── layouts
    │   └── default.html.coffee
    └── public
        ├── images
        └── vendor
</pre>

outは、docpadが出力する静的ファイル群で、基本src配下を弄る。スクリプトを書くにはCoffee以外にRoyやMoveも使えるみたいで、Markupには、Markdown以外にEcoやJade, Hamlとかいけるみたい。Styleは、Stylus, Less, Sassなどが使える。とりあえず、記事はpostsディレクトリをほってそこにmarkdownファイルを作っていく事にし、レイアウトやフロントページは、記事一覧表示するのでCoffeeで書いた。Styleは、みんな知ってるLearnBoostのTJ Holowaychuk aka **visionmedia製 Stylus**にしてみた。

 - CoffeeScript http://coffeescript.org/
 - Markdown http://daringfireball.net/projects/markdown/
 - Stylus http://learnboost.github.com/stylus/

Deploy
------

GitHubをoriginリポジトリにして、*pushしたらwebhookでGitHubからpullするようにしてdeploy*するようにした。Deploy先にリモートリポジトリ作っても良かったけどそこにpushするのがめんどかったのでwebhookにしたけど、*もっといいやり方があれば誰か教えて欲しい*。

 - Github repository https://github.com/linyows/tomohisaoda.com
