+++
date = "2018-05-16T09:00:00+09:00"
title = "WEB+DB PRESSにHashicorp Vaultの記事を寄稿した"
tags = ["vault", "security", "wdpress"]

+++

[WEB+DB PRESS][wdpress]の「実践！先進的インフラ運用」という連載の最後として、[Hashicorp Vault][vault]の記事を[Vol.104][wdpress]に寄稿しました。記事には、[Hashicorp Vault][vault]（以下、Vault）を用いた「秘密情報の一括管理」として、秘密情報の管理の必要性をはじめ、秘密情報の管理の大変さ、そして[Vault][vault]は何を解決して何ができるのか、を書きました。

<figure id="WEB+DB PRESS Vol.104" align="center"><figcaption style="color:ccc;padding-bottom:10px;">WEB+DB PRESS Vol.104: 嬉しいことに表紙に見出し</figcaption> <a href="https://www.amazon.co.jp/gp/product/4774196886/ref=as_li_tl?ie=UTF8&tag=linyows-22&camp=247&creative=1211&linkCode=as2&creativeASIN=4774196886&linkId=290fe95e6d3a4406ab3dde986b101f55"><img alt="WEB+DB PRESS Vol.104" src="https://user-images.githubusercontent.com/35430/38539611-dabfe508-3cd3-11e8-82a9-44818bf44a5d.jpg" width="200"></a> </figure>

[Vault][vault]は、インフラを自動化するソフトウェアを作ってきた[Hashicorp][hashicorp]ならではの、セキュリティ対策や技術またはアイデアがたくさん詰まっているので、ちゃんと理解するには、必要な前提知識や連携するソフトウェアの説明が必要なんですが、今回は残念ながら記事でそれらを省いています。なので、読者によってはわかりにくいかもしれません。それでも、初稿で予定の1.5倍の分量になってしまい削るのに苦労しました（[@inao][inao]さんにはお手数おかけしました）。

[WEB+DB PRESS Vol.104][wdpress]の当該記事を読んでいただけるとわかりますが、[Vault][vault]には、秘密情報を管理するたくさんの機能があります。私は、今回記事を書くにあたって、オフィシャルサイトのドキュメントをくまなく読みました。そこで、[Vault][vault]の全体像が見えた時、そのたくさんの機能が[Vault][vault]の本質を見えにくくしているような印象を感じました。秘密情報のアクセス権限をバージョン管理できること、できるだけ短いサイクルで秘密情報へのアクセス権限を更新すること、秘密情報へのアクセスをすべて記録すること、の３点が[Vault][vault]のポリシーとしてソフトウェアの中心にあって、その前提のもと、様々な秘密管理としての機能を持っている、ということに気がつきました。[Vault][vault]は、オフィシャルサイトで秘密情報管理ツールと定義されていますが、私は「セキュリティ対策をシステム全体でいい感じにする君」だと捉えていいのではないかと思っています。上述の３点は、堅牢さと柔軟さと使いやすさを実現していて、よく考えられていると感心します。

また、[Vault][vault]が備えるたくさんの機能においても、便利だけでなく学ぶことが多いです。セキュリティ対応は、**適切なタイミングで適切な対応を行うことが効率よく効果を発揮する**、と私は考えています。例えば、水を溜めるバケツがあって、「バケツに穴が空いたらどうやって水の漏洩を最小限に防ぐか（これはこれで必要な議論ではありますが）」よりもまず「そもそもバケツに穴が空かない方法」を考えることがべきです。なので、そのようなセキュリティ対応としての正しさを、[Vault][vault]の機能を使うことによって、考えさせられるというのもメリットがある気がしています。

記事中にも書きましたが、コストのかかる秘密情報管理やセキュリティ対応は何かと後回しにされがちです。覆水盆に返らず。[Vault][vault]を使って、今一度、システムのセキュリティを見直しても良いのではないでしょうか。各位、意識高めて、やっていきましょう。

Sequelize Vault
---------------

RailsのActive Recordで扱うカラムを透過的に[Vault][vault]で暗号化／復号をするvault-railsを使ったハンズオンを記事中で紹介しましたが、Node.jsの代表的なO/R Mapperである Sequlizeでそれと同様の機能をもつパッケージを作ったので、以下ご紹介します。

- Hashicorp製のAR拡張  
  https://github.com/hashicorp/vault-rails
- 今回作ったSequelize拡張  
  https://github.com/linyows/sequelize-vault

使い方は、リポジトリのREADMEにあるように、定義したModelオブジェクトを呼び出したSequelize Vault関数の引数に渡すだけです。そうすると、BeforeSaveやAfterFindなどのSequelize Hookが登録され、暗号化／復号が行われていることを感じさせないように使えます。vault-railsと異なり、sequelize-vaultが1つ便利な点は、**暗号化前の生データで検索が行える点**です。

```js
const Sequelize = require('sequelize')
const SequelizeVault = require('sequelize-vault')

const s = new Sequelize({
  username: 'root',
  password: '',
  dialect: 'sqlite',
  database: 'test',
})
const User = s.define('user', {
  ssn_encrypted: Sequelize.STRING,
  ssn: Sequelize.VIRTUAL,
})

SequelizeVault.Vault.app = 'fooapp'
SequelizeVault.Vault.address = 'http://master-vault'
SequelizeVault.default(User)

const u = await User.create({ ssn: '123-45-6789' })
console.log(u.ssn_encrypted)
// vault:v0:EE3EV8P5hyo9h...
```

Many Thanks
-----------

執筆にあたって、[@inao][inao]さんは、スムーズなスケジューリングや適切な編集をありがとうございました。
また、なんども記事のレビューをしていただいた[@monochromegane][monochromegane]さんをはじめ、GMOペパボのみなさん、ありがとうございました。
あと、記事のフィードバックはとても嬉しいですね。[@r_takaishi][rtakaishi]さんありがとうございます。

<blockquote class="twitter-tweet" data-lang="en"> <p lang="ja" dir="ltr">自分の記事読んで試した系ありがたや！！！ぼくもKubernetes環境でVault便利だと思うんですよね / Hashicorp VaultのPKI Secerts Engineを試す <a href="https://t.co/T6EUBjkrUn">https://t.co/T6EUBjkrUn</a> <a href="https://twitter.com/hashtag/wdpress?src=hash&amp;ref_src=twsrc%5Etfw">#wdpress</a></p> &mdash; linyows (@linyows) <a href="https://twitter.com/linyows/status/994033782448521216?ref_src=twsrc%5Etfw">May 9, 2018</a> </blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

[vault]: https://www.vaultproject.io/
[wdpress]: https://www.amazon.co.jp/gp/product/4774196886/ref=as_li_tl?ie=UTF8&amp;tag=linyows-22&amp;camp=247&amp;creative=1211&amp;linkCode=as2&amp;creativeASIN=4774196886&amp;linkId=290fe95e6d3a4406ab3dde986b101f55
[hashicorp]: https://www.hashicorp.com/
[inao]: https://twitter.com/inao
[rtakaishi]: https://twitter.com/r_takaishi
[monochromegane]: https://twitter.com/monochromegane
