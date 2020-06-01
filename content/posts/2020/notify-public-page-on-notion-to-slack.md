---
title: "NotionのPublicページ一覧を継続的にSlackへ通知する"
date: 2020-06-02T00:09:00+09:00
tags: ["typescript", "notion"]
eyecatch: "images/notion.png"
---

NotionをTeam Planで会社で契約して[使っています](https://tech.pepabo.com/2019/11/19/why-notion/)。
Notionについて今更説明することは不要だと思いますが、構造化ドキュメントを複数人で管理するのにとても便利の良いサービスで、現在約300人ぐらいで1つのワークスペースを使っています。
最近のリモートワーク環境において、Notionはなくてはならないサービスです。あらゆることをドキュメント化して、地理的な距離によるコミュニケーションを効率化しています。
世界規模のフルリモートワークカンパニーとしてGitLabが挙げられると思いますが、GitLabもフルリモート環境をうまく機能させるのためには、[すべてをドキュメント化しなさい](https://about.gitlab.com/resources/downloads/ebook-remote-playbook.pdf)と言っています。

## Problem in Notion

私たちは、それなりの規模でNotionを使っていて、Notionの便利な機能の一つである、ページをWebへPublicにする機能も使っています。
