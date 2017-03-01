+++
date = "2017-03-01T10:20:20+09:00"
draft = true
title = "Cのプロダクトを作るためにやったこと"

+++

今年に入って Octopass というプロダクトを公開しました。
それは、Linuxのユーザや権限をGithubのTeamと連携して運用を楽にするというツールでした。

OSS界隈で有名な@matumotoryさんやそのほかのtweetによって、はてぶの数やコメントを見る限り、
ある程度必要そうな人の目に触れたのではないかと思っています。

また、「すごく便利」「ぜひ導入したい」というフィードバックはとてもモチベーションにつながっています。

さて、この Octopass は、Linuxユーザ名前解決をするためにの glibc の libnssモジュールをCで実装しています。
cgoやその他の言語でShared Objectを吐き出しても良かったのですが、それだと技術的挑戦が足りないとして、
触れてこなかったCに挑戦してみました。

まず、自分が作るのがlibnssのモジュールなので既存のものをgithubで検索してひたすら読んでみました。
最初に気になったのが、coding styleがバラバラなこと。

- Clang Format
- Unit Test
- Makefile
- Integration Test
- DokcerCompose
