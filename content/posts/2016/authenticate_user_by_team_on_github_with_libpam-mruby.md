+++
date = "2016-12-16T00:00:00+09:00"
title = "libpam-mrubyを使ってGithubのチーム認証をする"
draft = true
tags = ["mruby", "pam", "auth", "github"]

+++

このエントリは [mruby Advent Calendar 2016 - Qiita][adventc] 15日目の記事です。
[adventc]: http://qiita.com/advent-calendar/2016/mruby

気がつけば、ブログをadvent calendar書く頻度でしか更新しておらず、
もっとなんか書かなきゃなという気持ちで、*来年から頑張る*という決意しております。
これまでmrubyに触れてこなかったのでAdvent Calendar駆動でmrubyを触ってみようという流れです。

### 管理が楽でシンプルな認証

なんとなく、linuxの認証まわりをLDAPじゃないもっとシンプルな何かに出来ないかなという考えがあって、
それを @pyama氏 が `STNS`という一元管理しやすいソリューションツールを作って「すごいなー」「便利だなー」と思いつつ
僕としては、Githubのチームがそのまま認証になったら「それでいいやん」という気持ちを持っていたのでした。
そこで、antipopさんやudzuraさんが去年あたりにやってた `libpam-mruby` を使ってGithub認証をしてみます。

### libpam-mruby

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

そして、`/etc/pam.d/system-auth-ac` の認証を `pam_unix` から `pam_mruby.so` に変更します。

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

これで `su <github username>` するとパスワードにgithub tokenを入力すると認証が成功するようになります。
また、`/etc/pam.d/sshd` にも pam-mruby.so を入れると sshログインに関してもmrubyでの認証が可能となります。
ただ、存在しないユーザに対してはもちろん認証出来ないのであらかじめuserを作っておく必要があります。

ということで、パスワード認証であること、Githubに依存することはさておき、
管理をGithubのOrganizationに作ったTeamに任せるだけで専用のサーバを立てたり、
AWSでAPI GatewayやLambdaを準備する必要がないのは非常に手軽なのではないでしょうか。
鍵認証もlibnss-githubを作ればよいし、GithubがDownした時の案（default userでログインするなど）さえ準備できていれば十分な気はします。
ネックなのは、httpまたぐので認証にもたつくことでしょうか。

### libnss-ato

ここで、面白そうなnssモジュールを見つけたのでご紹介します。
名前解決できなかったuserを設定したユーザーに紐付けてしまうnssモジュールです。

Name Service Switch module All-To-One
https://github.com/donapieppo/libnss-ato

インストールは、リポジトリにrpmがあるのでyumで入れることができ、
あとは`nsswitch.conf` の `/etc/passwd` や `/etc/shadow` に `ato` を追加し、
紐付けるユーザーをconfとして定義するだけです。
しない

```
$ git clone https://github.com/donapieppo/libnss-ato.git
$ sudo yum install RPMS/x86_64/libnss-ato-0.2-1.x86_64.rpm
$ cat <<EOL | sudo tee /etc/libnss-ato.conf
vagrant:x:1000:1000:vagrant,,,:/home/vagrant:/bin/bash
EOL
```

すると、こんな感じであたかも存在することになりますが、uid等がvagrantになっていて非常に気持ち悪いです。

```
$ id foo
uid=1000(vagrant) gid=1000(vagrant) groups=1000(vagrant)
```

### mruby-github

せっかくなので、mruby用のgithub clientを作ってみました。
https://github.com/linyows/mruby-github

これは、`mruby-mrbgem-template` を使って作ったのですが、C言語のサンプルが出力されていて、mruby作法を知らない人には非常に便利でした。

### Reference

- Linuxユーザーと公開鍵を統合管理するサーバ&クライアントを書いた  
  https://ten-snapon.com/archives/1228
- libpam-mruby を試してみた  
  http://qiita.com/udzura/items/0817ac7cd703aaca6124
- libpam-mrubyによりmrubyでLinuxのログイン認証をする 
  http://blog.kentarok.org/entry/2015/12/22/231114
- mrubyの拡張モジュールであるmrbgemのテンプレートを自動で生成するmrbgem作った  
  http://blog.matsumoto-r.jp/?p=3923
