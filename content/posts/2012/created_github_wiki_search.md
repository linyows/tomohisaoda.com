+++
date = "2012-04-03T22:47:45+09:00"
title = "GithubでWikiを検索するUserScript書いた"
tags = ["github", "userscript"]
+++

Githubをがっつり使ってると、Wikiに仕様書いたりFAQや依存するModule書いたりと、Wikiを利用する機会は結構あって、Issueやソースコードには検索機能があるのに、Wikiには何故かないんだよね。Github内での優先順位が低いのかな？

最初は、[@morygonzalez](https://twitter.com/#!/morygonzalez)に「Wiki内って検索出来ないけどどうすんの？」って言われて、「cloneして`ack`叩けば？」って言ったものの、ターミナルアレルギーなデザイナーは仕方ないとして、自分も他プロジェクトのをいちいちcloneして探すのは確かに面倒だなあと思ったわけ。
なので、UserScriptを書いてみてGithub Wikiの全文検索がうまくいったのでお知らせしてみる。

Github Wiki Search - https://github.com/linyows/github-wiki-search

なんか、バグ見っけたらGithubにIssue登録お願いします。もしくは、*Pull Request*お願いします。

Screenshots
-----------

![screenshot1](https://github.com/linyows/github-wiki-search/raw/master/images/1.png)

ページ右上に検索ボックス。

![screenshot2](https://github.com/linyows/github-wiki-search/raw/master/images/2.png)

検索ワードを入力して`Enter`したら検索開始。

![screenshot3](https://github.com/linyows/github-wiki-search/raw/master/images/3.png)

検索結果は、非同期で見つかった順に表示。

Logic
-----

生のjsガリガリ書くのは面倒だったのでjQueryを使った。

以下、コード中やってること。

1. PagesタブにWikiの*全てのページのリンクがある*ので`GET`してページのURLリストを作成。
2. URLリストからコンテンツを`GET`して、検索文字をgrep。
3. grepしてmatchしたら結果表示しつつ、次のコンテンツを`GET`してgrepを繰り返す。

補足

- １度全ページロードしたらキャッシュしてる。ロードの状態は、プログレスバーで視覚的に分かるようにした。
- 検索結果表示数が多いと もともと何のページか分からなくなるのであえて少なくしてる。（Wikiってそんなにページ数少ないし...）

Install
-------

インストールは、**userscripts.org**に登録してるので*Install*ボタンからどうぞ。

http://userscripts.org/scripts/show/129930

ブラウザは、以下で一通り動作するのを確認済み。

- Chrome
- Firefox - need [Greasemonekey](https://addons.mozilla.org/ja/firefox/addon/greasemonkey/)
- Safari - need [NinjaKit](http://d.hatena.ne.jp/os0x/20100612/1276330696)
