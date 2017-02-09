+++
date = "2017-02-10T10:00:00+09:00"
title = "Linux Server管理者の管理を楽にする"
tags = ["C", "NSS", "Linux", "github"]

+++

昨年、libpam-mrubyを使って、Linux Serverにおける認証やその管理について思うところを書きました。

[libpam-mrubyを使ってGithubのチームで認証をする]({{< ref "posts/2016/authenticate_user_by_team_on_github_with_libpam-mruby.md" >}})

Linuxのユーザ管理といったら主に[LDAP（OpenLDAP）][ldap]だと思いますが、[LDAP][ldap]だと専門の知識が必要だし、
[LDAP][ldap]管理者でも触る頻度が低いと[LDAP][ldap]コマンドを毎回ググる事になり地味に面倒です。
結構複雑なので忘れるんですね。

また、[LDAP][ldap]っていろんな機能が盛りだくさんなんですが、
自分たちが[LDAP][ldap]を通して解決したいことって意外とシンプルだったりします。
それに気づかせてくれたのは[STNS][stns]で、[STNS][stns]はユーザや鍵の管理を[TOML][toml]で行うというプロダクトでした。
[TOML][toml]形式のファイルになるだけでgitで管理できますし、githubでpull-requestをすることもできます。
pull-requestが出来るということは、管理者は確認してマージするだけが作業となり、ホント面倒な処理から解放してくれる！そういうプロダクトです。

ただ、いくつか課題があって

- 追加・削除は容易だが、最初の設定ファイル作るのが面倒
- LDAPと同じくバックエンド（サーバなど）が必要
- 導入サーバによってはuidが被ってふがふが

みたいなことがあります。そこで [octopass][octopass] の登場です。

About Octopass
--------------

[octopass][octopass]は、Github APIを使って、Github Organization/Team によってlinuxユーザの名前解決を行い、
Githubに登録している公開鍵によってSSHDの認証とGithubのPersonal Access TokenでPAM認証をできるようにするプロダクトです。

<figure id="octopass" align="center">
<figcaption style="padding-bottom:10px;">Githubに依存するのでoctocatをモジってつけた名前、octopass</figcaption>
<img alt="OCTOPASS" src="https://github.com/linyows/octopass/blob/master/misc/octopass.png?raw=true" width="200">
</figure>

簡潔にまとめると

- octopass NSSモジュールが Github Org/Team メンバーを参照する
- octopass コマンドによってGithubのpublic keysを取得する
- octopass PAMヘルパーによって GithubのAuthorizationを得る

のようなことをやってくれるので、Linuxの管理者の管理をGithubのOrg/Teamメンバーの管理を通じて行えるわけです。

Questions
---------

ここで大体疑問に思うことはこんな感じでしょう。

- Github APIがDownしたらどうなるの？
- 海外のAPI越しに名前解決してたら遅いんでは？
- サーバ台数多いとAPIのRatelimit（制限）にかかるのでは？

はい。全部その通りです... ;-(
しかし、*上の2つはキャッシュによって解決しています。*

```
+------------------------+     +--------------------+
|           +----------+ |     |                    |
| +-------+ | Octopass | |     | Github API         |
| |       | |          +-----> |                    |
| | cache +-+ * NSS    | |     | * org/team members |
| |       | | * SSHD   | <-----+ * user public keys |
| +-------+ | * PAM    | |     | * basic auth       |
|           +----------+ |     |                    |
+------------------------+     +--------------------+
       Linux Server
```

[octopass][octopass]ではGithub APIのレスポンスボディをファイルキャッシュしていて、
何かしらの原因でGithub APIへのリクエストが200で返らなかった場合はキャッシュタイムを超えていてもキャッシュを使う仕様になっています。
また、キャッシュしているので名前解決に都度APIリクエストは投げません。

3つ目は、例えば、サーバ台数が10000台ある環境にoctopassを導入すると
Github APIの[Rate Limit][ratelimit]は 5,000/hour なので、即刻API制限されてしまう可能性はあります。
こういう場合は、Github APIにproxyを挟んでキャッシュしてもらうのがいいと思いますが、
そもそも、大規模なので[LDAP][ldap]その他のミドルウェアの方が向いていると言えます。

Conclusion
----------

このように、[octopass][octopass]を使えば、
自分たちの資産（コード）をGithubまたはGithub Enterpriseで管理している前提にはなりますが、
それ（資産）にコミットする権限と同じように、*関係するサーバにしても同じように権限を管理できるようになります。*

**なんてシンプル！**

Instration
----------

インストールは、RHEL/7 のみパッケージを作っているので yum でインストールが可能です。
（パッケージ置き場は[packagecloud][packagecloud]を利用しています）

```sh
$ curl -s https://packagecloud.io/install/repositories/linyows/octopass/script.rpm.sh | sudo bash
$ sudo yum install octopass-0.1.0-1.x86_64
```

他のバージョンや他のディストリビューションについては追々追加していきますが、
*手伝っていただける方がいれば非常に歓迎です！*

ソースからビルドインストールするには以下の方法です。

```sh
# 依存パッケージをディストリビューションに応じて入れてください
# glibc, libcurl, jansson
$ wget https://github.com/linyows/octopass/releases/download/v0.1.0/linux_amd64.zip
$ unzip linux_amd64.zip
$ mv octopass /usr/bin/
$ git clone https://github.com/linyows/octopass
$ cd nss
$ make && make install
```

インストールがすんだら設定ファイルを作ります。基本的には、Github APIを叩くための
[Personal Access Token][token]をTokenとして記述し、OrganizationとTeamを設定するだけになります。
ただ気をつけるのは、そのTokenは他のユーザから見えるのでGithub Organization Memberに対してread権限のみを持たせるのが吉です。
設定項目は[README.mdのConfiguration][conf]にあります。

```sh
$ cat <<EOF > /etc/octopass.conf
Token = "xxxxxxxxxxxxxxxxxxxxxxxxxxx"
Organization = "hoge"
Team = "fuga"
EOF
```

そして、各ファイルの項目に修正を加えます。

/etc/ssh/sshd_config:

```
AuthorizedKeysCommand /usr/bin/octopass
AuthorizedKeysCommandUser root
UsePAM yes
PasswordAuthentication no
```

/etc/pam.d/sshd:

```
session required pam_mkhomedir.so skel=/etc/skel/ umask=0022
```

/etc/nsswitch.conf:

```
passwd:     files octopass sss
shadow:     files octopass sss
group:      files octopass sss
```

これでGithubのアカウントと鍵でSSHログインができるようになります。
興味がある方は是非使ってみてください。バグ報告等お待ちしております！

Octopass: https://github.com/linyows/octopass

Next Ideas
----------

ちなみに、考えている次の機能はこちらです。

- 共有アカウント（デプロイ用のユーザなど
- 複数チームの設定

何かアイデアをお持ちの方も気軽に教えてくださいね。

[ldap]: http://www.openldap.org/
[stns]: http://stns.jp
[toml]: https://github.com/toml-lang/toml
[ratelimit]: https://developer.github.com/v3/#rate-limiting
[octopass]: https://github.com/linyows/octopass
[packagecloud]: https://packagecloud.io/linyows/octopass
[conf]: https://github.com/linyows/octopass#configuration
[token]: https://github.com/settings/tokens/new
