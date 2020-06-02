---
title: "NotionのPublicページ一覧を継続的にSlackへ通知する"
date: 2020-06-02T00:09:00+09:00
tags: ["typescript", "notion"]
eyecatch: "images/notion.png"
---

Notionを会社でTeam Planを契約して[使っています](https://tech.pepabo.com/2019/11/19/why-notion/)。
Notionを説明することは、今更不要だと思いますが、構造化ドキュメントを複数人で管理するのにとても便利の良いサービスです。
最近、NotionがFreeプランのブロック数を無制限にしたので、使う人は今後どんどん増えるでしょう。
私たちは、現在約300人ぐらいで1つのワークスペースを使っています。ページ数は1700ページぐらいで、日々増しています。
最近のリモートワーク環境において、Notionはなくてはならないサービスです。
あらゆることをドキュメント化して、地理的距離によるコミュニケーションコストを効率化しています。
世界規模のフルリモートワークカンパニーとしてGitLabが挙げられると思いますが、GitLabもフルリモート環境をうまく機能させるのためには、[すべてをドキュメント化しなさい](https://about.gitlab.com/resources/downloads/ebook-remote-playbook.pdf)と言っています。

## Problem in Notion

私たちは、300人というそれなりの人数規模でNotionを使っていて、Notionの便利な機能の一つである、ページをWebへPublicにする機能も多からず使っています。
ただ、気軽にページを世界に公開できるとなると、それはそれで情報漏洩などリスクがあります。
もちろん、秘匿情報をページに載せないルールはありますが、人の運用ベースだと絶対ではありません。
Enterprise Planを利用すると、Publicにする機能をDisableにすることは出来ますが、どこかのページを公開したい場合には別のワークスペースを用意する必要があり不便です。また、この機能のためにプランのアップグレードを行うには金額が高い（$8 -> $20）のです。
要は、ページを公開している一覧を定期的に通知して、誤って公開しているページがないかを確認したいのです。

## Using API for Notion

Notionは、今のところAPIを提供していません。
しかし、BrowserのConsoleから見る限りWebページをReactで実装していて、内部APIをCookie HeaderにTokenを付与して叩いています。
つまり、CookieでTokenさえ渡せば、内部APIを使えるということになります。GitHubで、Notion APIで検索するとUnofficialなClientがいくつか見つかります。

- https://github.com/jamalex/notion-py
- https://github.com/kjk/notionapi

そうとわかれば、あとは、BrowserのColsoleからXHRのBodyとレスポンスBodyを拾って使えるものを探すだけです。
Endpointの名前と叩かれるタイミングを見て想像しながら、全ページの公開設定を取得するにはどうしたら良いかを考えます。すると、以下のEndpointがリクエストBody無しで包括的な情報を返してくれることがわかりました。おそらく、左側に配置されるナビゲーションを構成するものだと思います。

```sh
$ curl -s -X POST -H 'Content-Type: application/json' -H "Cookie: token_v2=$TOKEN" \
    https://www.notion.so/api/v3/loadUserContent | jq '.["recordMap"]|keys'
[
  "block",
  "collection",
  "notion_user",
  "space",
  "space_view",
  "user_root",
  "user_settings"
]
```

冒頭に書いた通り、Notionは構造化ドキュメントなので、Rootページがまず取得できれば枝葉のページは取れるはずです。
どうやら `block` にRootページのIDが含まれていて、そのIDをBodyとしたリクエストを `loadPageChunk` に投げるとページのコンテンツが返ってきました。

```sh
$ curl -s -X POST -H 'Content-Type: application/json' -H "Cookie: token_v2=$TOKEN" \
    -d '{"pageId":"081...","limit": 50, "cursor": { "stack": [] }, "chunkNumber": 0, "verticalColumns": false }' \
    https://www.notion.so/api/v3/loadPageChunk | jq '.["recordMap"]|keys'
[
  "block",
  "collection",
  "collection_view",
  "comment",
  "discussion",
  "notion_user",
  "space"
]
```

すると、 `block` にリンクする子ページ情報が入っているので、再帰メソッドを書くことで、Notion上のページ情報を網羅的に取得できることができました。
いくつか、つまづきポイントがあったのですが、リンクだけを辿っていくと再帰が終わらずループするということ、外部Workspaceのリンクがあると無駄なAPIリクエストが発生するといったことがありました。
Root以外の全てのページには、 `parent_id` というのを持っており、この `parent_id` はリンク元を指しているわけですが、再帰処理の中でこのリンク元を照らし合わせ、正しい親子関係になっているページの場合のみ再帰を続けるという処理にして回避しました。

## Running on Google App Script

さて、これらは定期的に実行し、結果をSlackに通知させたいので、Google App Scriptで走らせます。スクリプトは、TypeScriptで実装しました。出来たのは以下です。

*Notion Agent*  
https://github.com/linyows/notion-agent

以下のような通知になります。

![Notion Agent Capture](/images/notion-agent-capture.png)

## Conclusion

Browserの挙動からリバースエンジニアリングで、NotionのPublicページ一覧を継続的にSlackへ通知できるようにしました。難しいことは一つもありません、気合だけです。 この ~クソ~ スクリプトが誰かのお役に立てれば幸いです。
