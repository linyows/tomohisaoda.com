+++
date = "2012-05-04T22:46:03+09:00"
title = "S3 の画像をリアルタイムにリサイズするServer書いた"
tags = ["S3", "node", "AWS"]

+++

S3に配置した画像を**URLから指定したサイズ**にリサイズできるリアルタイムリサイズサーバをnodeで書いた。

Features
--------

- スケーラブルでハイパフォーマンス。
- 導入はとっても簡単。
- 複数のバケットが使える。
- 賢いキャッシュ。（ファイルサイズと更新日から304を返す）

Architecture
------------

1台構成

```console
+---------+      +------------+      +------------+      +----+
| Browser | <--> | CloudFront | <--> | EC2 (hose) | <--> | S3 |
+---------+      +------------+      +------------+      +----+
```

スケールアウト

```console
                                                  +------------+
                                                  | EC2 (hose) |
+---------+      +------------+      +-----+      +------------+      +----+
| Browser | <--> | CloudFront | <--> | ELB | <-->                <--> | S3 |
+---------+      +------------+      +-----+      +------------+      +----+
                                                  | EC2 (hose) |
                                                  +------------+
```

- SSLに対応していないので、ELBとhoseの間に*NGINXなどを挟んだ方がいい*。

Url
---

```console
//hose.com/bucket/key/100x50cq75/802a393d7247aa0caf9056223503bdf611d478ee.jpg
```

- bucketは、*configファイルに書けば*省略することができる。
- keyは、拡張子ナシのS3のキーで、*指定バケットのファイルまでのパス*。
- 100x100cq75は、width x hight crop quality の組み合わせ。
- 最後のファイル名は、S3のプライベートキーで作成した*HMAC*と拡張子。

This is called "hose"
---------------------

プロジェクト名は"hose"。最近、[@gosukenator](https://twitter.com/#!/gosukenator)さんからこの"hose"にPull Requestもらって、一昨年に書いて放置してたのをリファクタリングしたのでブログで告知です。(テストをまだ書いてないのでまだ微妙) ほんと、*Pull Requestってモチベーションあがる*よね、すごいいい仕組み！自分もできるだけほかのプロジェクトにPull Requestしていこうと思う。

"hose"はそもそもcookpad [@mirakui](https://twitter.com/#!/mirakui)さんの[tofuのスライド](http://www.slideshare.net/mirakui/ss-8150494)を見たのがきっかけ。Railsアプリケーションとかだと、[Paperclip](https://github.com/thoughtbot/paperclip)使うのがお手軽だったりするんだけど、画像サイズが固定だったりするから後でサイズを変更したいときは、バッチでリサイズ処理やったりと結構大変。また、Applicationサーバでリサイズ処理をやるのはそもそもリソースがもったいないよね。そこで"hose"なら全部解決できるってわけ。

特に、*AWS使うなら絶対に便利*だと思うので、たくさんの人に使ってもらいたい。

hose - https://github.com/linyows/hose

なんか、バグ見っけたらGithubにIssue登録お願いします。もしくは、*Pull Request*お願いします。
