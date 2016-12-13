+++
date = "2016-12-16T00:00:00+09:00"
title = "Immutable Infrastructure時代の認証を考える"
draft = true
tags = ["immutable infrastructure", "mruby"]

+++

このエントリは [mruby Advent Calendar 2016 - Qiita][advent-calendar] 15日目の記事です。
[advent-calendar]: http://qiita.com/advent-calendar/2016/mruby

気がつけば、ブログをadvent calendar書く頻度で更新していて、もっとなんか書かなきゃなという気持ちで、来年から頑張るという決意しております。
そして、`Immutable Infrastructure時代の認証を考える` という大風呂敷なタイトルにしてしまい申し訳ありません。
ここで指している認証はPAMの利用が代表的なlinuxの認証の事です。

### Immutable Infrastructureとは

2013年頃から言われている概念なので今更感がありますが、インフラの可変運用を捨て去り *不変* を前提とする事で、
いわゆる *Auto Scaling* や *Blue-Green Deployment* を可能にしたってやつです。
これは、AWS、AzureやGCPの登場よってもたらされたインフラのポータビリティによるものでしょう。詳しくは以下の記事をご覧ください。

今さら聞けない Immutable Infrastructure - 昼メシ物語
http://blog.mirakui.com/entry/2013/11/26/231658

### これまでの認証

これまでのLDAP


