+++
date = "2018-05-15T00:09:00+09:00"
title = "WEB+DB PRESSにHashicorp Vaultの記事を寄稿した"
tags = ["vault", "security", "wdpress"]

+++

[WEB+DB PRESS][wdpress]の「実践！先進的インフラ運用」という連載の最後として、[Hashicorp Vault][vault]の記事を[Vol.104][wdpress]に寄稿しました。記事には、[Hashicorp Vault][vault]を用いた「秘密情報の一括管理」として、秘密情報の管理の必要性をはじめ、秘密情報の管理の大変さ、そしてVaultは何を解決して何ができるのか、を書きました。

<figure id="WEB+DB PRESS Vol.104" align="center"><figcaption style="color:ccc;padding-bottom:10px;">WEB+DB PRESS Vol.104: 嬉しいことに表紙に見出し</figcaption>
<a href="https://www.amazon.co.jp/gp/product/4774196886/ref=as_li_tl?ie=UTF8&tag=linyows-22&camp=247&creative=1211&linkCode=as2&creativeASIN=4774196886&linkId=290fe95e6d3a4406ab3dde986b101f55"><img alt="WEB+DB PRESS Vol.104" src="https://user-images.githubusercontent.com/35430/38539611-dabfe508-3cd3-11e8-82a9-44818bf44a5d.jpg" width="200"></a>
</figure>

[Hashicorp Vault][vault]は、オフィシャルに秘密情報管理ツールと謳われていますが、それだとどのようなソフトウェアなのかあまりピンとこないので、私は「セキュリティ対策をWebシステム全体でいい感じにする君」と言ってしまった方が良い気がしています。

[Hashicorp Vault][vault]は、インフラを自動化するソフトウェアを作ってきた[Hashicorp][hashicorp]ならではの、セキュリティ対策や技術またはアイデアがたくさん詰まっているので、ちゃんと理解するには、必要な前提知識や連携するソフトウェアの説明が必要なんですが、今回は残念ながら記事でそれらを省いています。なので、読者によってはわかりにくいかもしれません。それでも、初稿で予定の1.5倍の分量になってしまい削るのに苦労しました（編集の稲尾さんにはお手数おかけしました）。

[WEB+DB PRESS Vol.104][wdpress]の当該記事を読んでいただけるとわかりますが、[Hashicorp Vault][vault]には、秘密情報を管理するたくさんの機能があります。そのたくさんの機能が、かえってVaultの本質を見えにくくしているような気もしています。私が考えるVaultは、動的（またはプラガブル）に秘密情報を管理出来ること、できるだけ短いサイクルで秘密情報へのアクセス権限を更新すること、秘密情報へのアクセスをすべて記録すること、が本質じゃないかなあと考えていて、それらを実現する機能がたくさん存在しているという風に捉えています。

セキュリティ対応は、適切なタイミングで適切な対応を行うことが効果を発揮する、と私は考えています。例えば、水を溜めるバケツがあって、「バケツに穴が空いたらどうやって水の漏洩を最小限に防ぐか（これはこれで必要な考えではありますが）」よりもまず「そもそもバケツに穴が空かない方法」を考えるべきです。なので、そのようなセキュリティ対応としての正しさを、Vaultを使うことによって学べるというのもメリットがある気がしています。

ということで、各位、優先度高めてセキュリティやっていきましょう。

Sequelize Vault
---------------

RailsのActive Recordで扱うカラムを透過的にVaultを暗号化／復号をするGem: vault-railsが、[Hashicorp][hashicorp]から提供されていますが、それと同様にNode.jsのORMである Sequlizeを拡張してVaultと連携するSequelize Vaultというパッケージを作りました。

使い方は、GithubのREADMEにあるように定義したModelオブジェクトをSequelize Vaultからdefault exportをimportして引数に渡すだけです。

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

https://github.com/hashicorp/vault-rails
https://github.com/linyows/sequelize-vault

一つ、vatul-railsと違う点は、暗号化前の生データで検索ができる点です。

---

<blockquote class="twitter-tweet" data-lang="en"><p lang="ja" dir="ltr">自分の記事読んで試した系ありがたや！！！ぼくもKubernetes環境でVault便利だと思うんですよね / [Hashicorp Vault][vault]のPKI Secerts Engineを試す <a href="https://t.co/T6EUBjkrUn">https://t.co/T6EUBjkrUn</a>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

記事のフィードバックエントリーはとても嬉しいですね。ありがとうございます。

[vault]: https://www.vaultproject.io/
[wdpress]: https://www.amazon.co.jp/gp/product/4774196886/ref=as_li_tl?ie=UTF8&tag=linyows-22&camp=247&creative=1211&linkCode=as2&creativeASIN=4774196886&linkId=290fe95e6d3a4406ab3dde986b101f55
[hashicorp]: https://www.hashicorp.com/
