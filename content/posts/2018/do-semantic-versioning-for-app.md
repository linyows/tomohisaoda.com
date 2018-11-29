---
title: "Semantic Versioningをアプリケーション開発でやっていく"
date: 2018-11-29T10:00:00+09:00
tags: ["semver", "development", "go"]
eyecatch: "images/semver.png"
---

ソフトウェアのバージョン管理は、かつて曖昧なものでした。Semantic Versioningは、バージョニングを明確に定義し文書化したものです（TOMLやGitHub創設者で有名なTom Preston-Wernerのプロジェクト）。これにより、OSS界隈の人々はバージョニングの意味を共通認識可能なものとして、早くから導入していました。最近では、Goの標準モジュール管理としてもSemantic Versioningが利用されることになり、Goのライブラリ開発者は否が応でもSemantic Versioningを考える必要があります。

> 1. APIの変更に互換性のない場合はメジャーバージョンを、
> 1. 後方互換性があり機能性を追加した場合はマイナーバージョンを、
> 1. 後方互換性を伴うバグ修正をした場合はパッチバージョンを上げます。
>
> プレリリースやビルドナンバーなどのラベルに関しては、メジャー.マイナー.パッチの形式を拡張する形で利用することができます。
>
> <cite>セマンティック バージョニング 2.0.0 概要 https://semver.org/</cite>

[Semantic Versioningの詳細な仕様](https://semver.org/)については、オフィシャル文書をご覧いただくとして、私は、このバージョニングの重要なエッセンスは *「互換性を壊すものを明確にしなさい」* だと思っています。なので、あるソフトウェアでSemantic Versioningの仕様（ルール）が守られているから、ソフトウェア利用者は安心して導入できます。私は、この共通認識可能で便利なバージョニングをアプリケーション開発にも導入していきたいと思ったのでした。

## アプリケーション開発におけるバージョン管理

私たちは、これまでアプリケーション開発においてリリースが行われると、デプロイ後に日時で`git tag`によるソースコードの保全をし、GitHub Releasesに以前のソースコードからの差分（いわゆるchangelogやP/Rへのリンク）を内容として記録していました。これはこれでうまく動いていましたが、ユーザからみて破壊的な変更があったリリースかどうかは、P/Rの内容を見なければわかりませんでした。また、不具合の問い合わせに対応する際にカスタマーサービス直近のリリースがどういう種類のものであるかということを、簡単に識別できませんでした。

## Semantic Versioningの導入

アプリケーション開発は、ライブラリやモジュールなどの開発とそもそも粒度がちがうので、データベースや関連するサービスをプロダクションに近いものを開発環境に用意した状態でも、ステージングでbotまたは人による検証が必要だったりします。この場合、バージョニングに`pre-release`を使用します。また、`pre-release`は、並列で発生することもあるので、`build`としてメタ情報をバージョンに付加します。これにより、一般的な *Continuous Deliveryのフローに、Semantic Versioningを乗せる* ことができます。

```
# pre-releaseの例
v1.2.3-alpha
v1.2.3-rc.0

# meta情報の例（short hashとusername）
v1.2.3-rc.0+a2a784b.linyows
```

## Git Tagの問題

ソフトウェアのバージョン管理にGitを使用している場合、`git tag`コマンドからtagのリストを確認しますが、`git tag`の[Sort Option](https://git-scm.com/docs/git-tag#git-tag---sortltkeygt)を使ってもSemantic Versioning特有の`pre-release`があるとバージョンとして古い問題がクリアできません。具体的には以下のようになります。

```sh
$ git tag -l --sort="version:refname"
...
test1 # Semantic Versioningに沿ってないもの
v1.0.0
v1.1.0
v1.1.0-rc # v1.1.0より古いはずが後ろに並ぶ
v1.2.0
```

また、アプリケーションが成長してバージョンが増えてくると、最新のバージョンが何なのか一目でわかりませんし、自分用に作ったタグが含まれていたり、これから新しくリリースしようとするバージョンが何になるのかすぐにわかりません。このような状態は、開発フローの中でストレスとなり、Semantic Versioningは向いてないのではないかという議論にも発展しかねません。

## Gitサブコマンドを作成

そこで、私は`git tag`のSemantic Versioningを対応すべく、Gitサブコマンドを作りました。リポジトリと使用方法は以下です。

git-semv: https://github.com/linyows/git-semv

### Semantic Versioningに沿っている一覧の表示

```sh
$ git semv
v0.0.1
v0.0.2
v1.0.0
v1.1.0
v1.1.1

# pre-releaseを含む全てのバージョンの表示
$ git semv --all
v0.0.1
v0.0.2
v1.0.0-alpha.0+a2a784b.linyows
v1.0.0-beta.0+ba8a247.foobar
v1.0.0-rc.0
v1.0.0-rc.1
v1.0.0
v1.1.0
v1.1.1
v2.0.0-alpha.0
```

### 最新のバージョンを表示

```sh
$ git semv now
v1.1.1
```

### 次のバージョンを表示

```sh
# パッチバージョン
$ git semv patch
v1.1.2

# マイナーバージョン
$ git semv minor
v1.2.0

# メジャーバージョン
$ git semv major
v2.0.0
```

### プレリリースなどのオプション

```sh
# メジャーバージョンアップのプレリリース（すでにあるalphaがインクリメントされている）
$ git semv major --pre
v2.0.0-alpha.1

# プレリリースの名前を指定する
$ git semv major --pre-name beta
v2.0.0-beta.0

# ビルド情報を付加する（デフォルトだと現在のバージョンのshort hashとusername）
$ git semv minor --build
v1.2.0+9125b23.linyows

# ビルド情報を指定して付加する
$ git semv minor --build-name superproject
v1.2.0+superproject

# タグ作成とremoteへpushを行う（git tag v1.1.2 && git push origin v1.1.2）
$ git semv patch --bump
Bumped version to v1.1.2
```

## 類似ソフトウェアとの違い

gobump: https://github.com/motemen/gobump

`git-semv`のような、Sematic Versioning管理を楽にするソフトウエアとして他に`gobump`が挙げられます。`gobump`は、ソースコード中に定義したバージョンをインクリメントしてくれますが、`git-semv`はソースコードに対して *何もしません* 。

これは、必要な機能を最低限にする目的もありますが、Goのようにコンパイルが必要な言語だと、ビルド時に必要な情報を付与できるので、あえてソースコード中で管理する必要がないためです。他の言語においても、ソースコード中のバージョンを変更したければ、`sed` などのコマンドと組み合わせることで簡単に行えます。また、`pre-release`や`build`にも対応しているので、`git-semv`は言語にとらわれず、ユーザ数が多いOSSやアプリケーション向きといえるでしょう。

## 他のソフトウェアとの組み合わせ

goreleaser: https://github.com/goreleaser/goreleaser

Goに限定すると、`git-semv`は`goreleaser`というソフトウェアと組み合わせることを想定しています。`goreleaser`は、GoのコンパイルとGitHub Releasesの作成を直前のタグにより作成してくれます。これをCIと組み合わせると、`git-semv`で作成したタグからCIがフックされ自動的にGitHub Releasesが作成されるというフローになります。

## まとめ

`git-semv`を利用することで、アプリケーションを簡単にSemantic Versioningで管理できるようになりました。Semantic Versioningを利用することで、日々のリリースがどのような変更なのか誰もがわかりやすくなりました。
