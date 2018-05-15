+++
date = "2018-05-15T00:13:23+09:00"
draft = true
title = "WEB+DB PRESS Vol.104にHashicorp Vaultの記事を寄稿した"
+++

WEB+DB PRESSの「実践！先進的インフラ運用」という連載の最後として、Hashicorp Vaultの記事を寄稿しました。記事には、Hashicorp Vaultを用いた「秘密情報の一括管理」として、秘密情報の管理の必要性をはじめ、秘密情報の管理の大変さ、そしてVaultは何を解決して何ができるのか、を書きました。



<figure id="WEB+DB PRESS Vol.104" align="center"><figcaption style="color:ccc;padding-bottom:10px;">WEB+DB PRESS Vol.104: 嬉しいことに表紙に記事見出しの記載><</figcaption><a href="https://www.amazon.co.jp/gp/product/4774196886/ref=as_li_tl?ie=UTF8&tag=linyows-22&camp=247&creative=1211&linkCode=as2&creativeASIN=4774196886&linkId=290fe95e6d3a4406ab3dde986b101f55"><img alt="WEB+DB PRESS Vol.104" src="https://user-images.githubusercontent.com/35430/38539611-dabfe508-3cd3-11e8-82a9-44818bf44a5d.jpg" width="100"></a></figure>



Hashicorp Vaultは、オフィシャルに秘密情報管理ツールと謳われていますが、それだとどのようなソフトウェアなのかあまりピンとこないので、私は「セキュリティ対策をWebシステム全体でいい感じにする君」と言ってしまった方が良い気がしています。

Hashicorp Vaultは、インフラを自動化するソフトウェアを作ってきたHashicorpならではの、セキュリティ対策や技術またはアイデアがたくさん詰まっているので、ちゃんと理解するには、必要な前提知識や連携するソフトウェアの説明が必要なんですが、今回は残念ながら記事でそれらを省いています。なので、読者によってはわかりにくいかもしれません。それでも、初稿で予定の1.5倍の分量になってしまい削るのに苦労しました（編集の稲尾さんにはお手数おかけしました）。

WEB+DB PRESS Vol.104の当該記事を読んでいただけるとわかりますが、Hashicorp Vaultには、秘密情報を管理するたくさんの機能があります。そのたくさんの機能が、かえってVaultの本質を見えにくくしているような気もしています。私が考えるVaultは、動的（またはプラガブル）に秘密情報を管理出来ること、できるだけ短いサイクルで秘密情報へのアクセス権限を更新すること、秘密情報へのアクセスをすべて記録すること、が本質じゃないかなあと考えていて、それらを実現する機能がたくさん存在しているという風に捉えています。

セキュリティ対応は、適切なタイミングで適切な対応を行うことが効果を発揮する、と私は考えています。例えば、水を溜めるバケツがあって、「バケツに穴が空いたらどうやって水の漏洩を最小限に防ぐか（これはこれで必要な考えではありますが）」よりもまず「そもそもバケツに穴が空かない方法」を考えるべきです。なので、そのようなセキュリティ対応としての正しさを、Vaultを使うことによって学べるというのもメリットがある気がしています。

ということで、各位、優先度高めてセキュリティやっていきましょう。

---

記事のフィードバックエントリーはとても嬉しいですね。ありがとうございます。

<blockquote class="twitter-tweet" data-lang="en"><p lang="ja" dir="ltr">自分の記事読んで試した系ありがたや！！！ぼくもKubernetes環境でVault便利だと思うんですよね / Hashicorp VaultのPKI Secerts Engineを試す <a href="https://t.co/T6EUBjkrUn">https://t.co/T6EUBjkrUn</a>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>