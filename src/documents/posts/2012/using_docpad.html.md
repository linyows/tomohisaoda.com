---
title: 'JekyllのNode版であるDocpadを使ってみる'
layout: 'default'
tags: ['markdown', 'javascript', 'docpad']
---

JekyllのNode版であるDocpadを使ってみる
======================================

なんか巷では、jekyll, octpress が流行っているっぽい。完全に乗り遅れたので、いや乗るつもりも無かったけど、node弄るのが比較的楽しいので、node.js版 jekyll の Docpadを使ってブログをはじめてみる。

Install
-------

docpadは、coffee-scriptで実装されていて、まずmacにcoffeeと一緒にインストールする。

```shell
$ npm install -g coffee-script docpad
```

プロジェクト用のディレクトリでスケルトン用コマンドを叩くとどのスケルトンを使うか聞かれるので選択する。

```shell
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
```

必要なモジュールがインストールされて、サーバーが`localhost:9778`に起動する。runコマンドは、scaffold, generate, watch, serverがラップされていて、インストール以降は、個別にコマンドを叩く。記事書いて確認したりするには、`$ docpad cli`が便利かも。docpadのコマンドをそのまま叩ける状態になるので、`server`と`watch`を叩く事で更新をlocalhostで確認しやすい。

```shell
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
```

こんな風に対話式にコマンドを叩ける

記事を書く
----------

以下は、ディレクトリ構成。

```shell
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
```

outは、docpadが出力する静的ファイル群で、基本src配下を弄る。とりあえず、記事はpostsディレクトリをほってそこにmarkdownファイルを作っていく事にした。
また、レイアウトファイルやその他のファイルはcoffeeで作ってみたけど、RoyやMoveも使えるみたいで、Markupには、Markdown以外にEcoやJade, Hamlとかいけるみたい。Styleは、Stylus, Less, Sassなど。

Deploy
------

GitHubをoriginリポジトリにして、pushしたらwebhookでGitHubからpullするようにしてDeployするようにした。

```shell

```
