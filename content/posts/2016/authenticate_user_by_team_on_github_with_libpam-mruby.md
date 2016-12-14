+++
date = "2016-12-15T00:00:00+09:00"
title = "libpam-mrubyを使ってGithubのチームで認証をする"
tags = ["mruby", "pam", "auth", "github"]

+++

このエントリは [mruby Advent Calendar 2016 - Qiita][adventc] 15日目の記事です。
[adventc]: http://qiita.com/advent-calendar/2016/mruby

気がつけば、ブログをadvent calendar書く頻度でしか更新しておらず、
もっとなんか書かなきゃなという気持ちで、_来年から頑張る_ という決意しております。
これまでmrubyに触れてこなかったのでAdvent Calendar駆動でmrubyを触ってみようという流れです。

管理が楽でシンプルな認証とは
----------------------------

僕はlinuxの認証まわりをLDAPじゃないもっとシンプルな何かに出来ないかなという考えがなんとなくあって、
それを [@pyama][pyama]氏 が STNS という一元管理しやすいソリューションツールを作って「すごいなー」「便利だなー」と賞賛しておりました。
ただ、Githubのチームがそのまま認証になったらサーバレスかつ管理が楽でさらに良いなって考えを持っていたのでした。
なので、[@antipop][antipop]さんや [@udzura][udzura]さんが去年あたりにやってた libpam-mruby を使ってGithub認証をしてみます。

[pyama]: https://twitter.com/pyama86
[antipop]: https://twitter.com/kentaro
[udzura]: https://twitter.com/udzura

Use libpam-mruby
----------------

libpam-mrubyは、PAMにmrubyを組み込んで認証部分をrubyで書くというものです。
なので、ビルドにmrubyのgemであるmgemを追加してあげれば大体やりたいことはできるし、
無ければmgemチャンスといったとこでしょう。

では、Github APIを叩くのに便利そうな `mruby-httprequest` と `mruby-polarssl`、
basic認証のために `mruby-base64` を追加してlibpam-mrubyをビルドします。

```
$ cat build_config.rb
MRuby::Build.new do |conf|
  toolchain :gcc
  conf.gembox 'default'
  conf.gem :github => 'luisbebop/mruby-polarssl'
  conf.gem :github => 'matsumoto-r/mruby-httprequest'
  conf.gem :github => 'mattn/mruby-base64'

  conf.cc do |cc|
    cc.flags << '-fPIC'
  end
end

$ rake
$ sudo install build/pam_mruby.so /usr/lib64/security/pam_mruby.so
```

そして、`/etc/pam.d/system-auth-ac` の認証を `pam_unix.so` から `pam_mruby.so` に変更します。

```
auth  sufficient  pam_mruby.so rbfile=/etc/pam-mruby.rb debug try_first_pass
```

認証ロジックは以下のような感じで、チームメンバーであるかとパスワードの整合性をチェックしています。

```
$ cat <<EOL | sudo tee /etc/pam-mruby.rb
def authenticate(username, password)
  api = 'https://api.github.com'
  token = 'github token'
  # あらかじめIDをAPIで取得しておく
  team_id = 1851462

  http = HttpRequest.new
  default_headers = {
    "User-Agent" => "mruby",
    "Authorization" => "token #{token}"
  }

  # team member?
  res = http.get("#{api}/teams/#{team_id}/members/#{username}",
    nil, default_headers)
  return false if res.code != 204

  # password correct?
  key = Base64::encode("#{username}:#{password}")
  res = http.get("#{api}/user",
    nil, default_headers.merge({"Authorization" => "Basic #{key}"}))
  res.code == 200
end
EOL
```

もちろん、トークンが書かれてるのでread権限を制限しておきます。

```
$ sudo chmod 600 /etc/pam-mruby.rb
```

これで `su <github username>` するとパスワードにgithub tokenを入力して認証が成功するようになります。
また、/etc/pam.d/sshd にも pam-mruby.so を入れると sshログインに関してもmrubyでの認証が可能となります。
ただ、存在しないユーザに対してはもちろん認証出来ないので _あらかじめuserを作っておく必要_ はあります。

ということで、「パスワード認証であること」「Githubに依存すること」はさておき、
管理をGithubのOrganizationに作ったTeamに任せるだけで専用のサーバを立てたり、
AWSでAPI GatewayやLambdaを準備する必要がないのは非常に手軽なのではないでしょうか。

公開鍵認証もsshdのAuthorizedKeysCommandからGithubから鍵取ってくればできるし、
GithubがDownした時の案（default userでログインするなど）さえ準備できていれば十分な気はします。
ネックなのは、httpまたぐので認証にもたつくことでしょうか。

Use libnss-ato
--------------

ここで、面白そうなnssモジュールを見つけたのでご紹介します。
名前解決できなかったuserを設定したユーザーに紐付けてしまうnssモジュールです。

Name Service Switch module All-To-One
https://github.com/donapieppo/libnss-ato

インストール・セットアップは、READMEにある通りですが、リポジトリにrpmのSPECファイルがあるので
ビルドしてyumで入れることができます。
あとは`nsswitch.conf` の `/etc/passwd` や `/etc/shadow` に `ato` を追加し、
紐付けるユーザーを `/etc/libnss-ato.conf` に定義するだけです。

```
$ git clone https://github.com/donapieppo/libnss-ato.git
$ cd libnss-ato
$ make rpm
$ sudo yum install RPMS/x86_64/libnss-ato-0.2-1.x86_64.rpm
$ cat <<EOL | sudo tee /etc/libnss-ato.conf
vagrant:x:1000:1000:vagrant,,,:/home/vagrant:/bin/bash
EOL
```

すると、存在しないuserがあたかも存在するかのように名前が引ける様になります。
uidやgidが紐づけたuserにすり替わっていて不思議な様子です。

```
$ id foo
uid=1000(vagrant) gid=1000(vagrant) groups=1000(vagrant)
```

当然ですが、`useradd foo` は既に存在するため作成できません。。。
しかし、このモジュールを使えば、
上記libpam-mrubyによって認証されたユーザは存在しなくても紐づけたユーザでログインできる様になります。

Use mruby-github
----------------

直接`mruby-httprequest`を使ってもコード少ないですが、
せっかくなのでmruby用のgithub clientを作ってみました。

linyows/mruby-github
https://github.com/linyows/mruby-github

このmgemを一緒にlibpam-mrubyをビルドしてやると上述の認証scriptは以下の様になります。

```
$ cat <<EOL | sudo tee /etc/pam-mruby.rb
def authenticate(username, password)
  token = 'github token'
  org_name = 'foobar'
  team_name = 'zoo'

  client = Github::Client.new
  client.token = token
  team = client.org_teams(org_name).find { |t| t['name'] == team_name }
  client.team_member?(team['id'], username) &&
    client.basic_authenticated?(username, password)
end
EOL
```

Teamを名前で指定してますが、変更する場合を想定してIDのままがいいかもしれません。
mruby-githubは、`mruby-mrbgem-template` を使って作ったのですが、
C言語のサンプルが出力されていて、mruby作法を知らない人には非常に勉強になります。

Conclusion
----------

mrubyをいじることでCのソース読んだりruby書いたりと、mrubyは複数の言語学べてお得だなという印象で、
libpam-mrubyを使うことで簡単にGithubのOrganization/Teamで連携認証が出来ました。
ただし、libpam-mruby を使わなくとも pam_exec を使って外部ファイル認証できるよってことは内緒です。

### Reference

- Linuxユーザーと公開鍵を統合管理するサーバ&クライアントを書いた  
  https://ten-snapon.com/archives/1228
- libpam-mruby を試してみた  
  http://qiita.com/udzura/items/0817ac7cd703aaca6124
- libpam-mrubyによりmrubyでLinuxのログイン認証をする  
  http://blog.kentarok.org/entry/2015/12/22/231114
- mrubyの拡張モジュールであるmrbgemのテンプレートを自動で生成するmrbgem作った  
  http://blog.matsumoto-r.jp/?p=3923
- pam_exec(8) - Linux man page  
  https://linux.die.net/man/8/pam_exec
