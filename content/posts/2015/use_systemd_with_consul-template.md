+++
date = "2015-12-14T17:36:35+09:00"
title = "consul-templateをsystemdで動かすときの学び"
tags = ["systemd", "consul-template"]

+++

このエントリは [HashiCorp Advent Calendar 2015 - Qiita][advent-calendar] 14日目の記事です。
[advent-calendar]: http://qiita.com/advent-calendar/2015/hashicorp

[consul-template][consul-template]は、[consul][consul]の様々なイベントをトリガーに指定したテンプレートファイルを元に指定したファイルを更新するためのデーモンです。
ユースケースは、[HAProxy][haproxy] や [Nginx][nginx] などロードバランサやリバースプロキシのバックエンドを、
状態に応じて動的にクラスタ（ロードバランサやリバースプロキシ）へ追加・削除し、可用性や拡張性を高めたい場合などです。
[consul-template]: https://github.com/hashicorp/consul-template
[consul]: https://www.consul.io/
[haproxy]: http://www.haproxy.org/
[nginx]: http://nginx.org/

今回、同様にnginxとconsul-templateを使って動的リバースプロキシを作ってみましたが、
それぞれをsystemdで管理するという点で幾つか学ぶことがありました。

私が最初に書いたconsul-templateのconfは以下です。commandによって、nginxのリロー
ドとslackに通知をするスクリプトを呼び出しています。

```
...
template {
  source = "/usr/lib/consul/templates/nginx.upstream_web.conf.ctmpl"
  destination = "/etc/nginx/conf.d/upstream_web.conf"
  command = "/bin/systemctl reload nginx.service && /usr/lib/consul/bin/notify_changed"
}
...
```

これで動かすと、consul-templateのイベントはロギングされ、nginxのリロードそして通知とあたかも正常に動いているようですが、nginxのconfは書き変わらないままです。
何かconsul-templateの設定がおかしいのかと[README.md][consul-template-readme]を読み直すと、テンプレートは`/tmp`に置いていることを見つけ、
systemdはcgroupsでリソース制御しているのを思い出します。なので、次は `/tmp` を使ってプロセス間でファイルの共有をやってみます。
[consul-template-readme]: https://github.com/hashicorp/consul-template/blob/master/README.md

```
...
template {
  source = "/tmp/nginx.upstream_web.conf.ctmpl"
  destination = "/tmp/nginx.upstream_web.conf"
  command = "/bin/systemctl reload nginx.service && /usr/lib/consul/bin/notify_changed"
}
...
```

すると、今度はconsul-templateからのnginxリロードに失敗するようになりました。

```
systemd[1]: PID file /run/nginx.pid not readable (yet?) after reload.
```

また、nginxのconfの書き換えが反映されません... なので、Nginxのsystemd service fileを眺めていると以下のオプションを見つけました。

```
PrivateTmp=true
```

これは、このサービス専用に独立した `/tmp` を使う設定のようで、これが機能しているた
めに、confの書き換えができないのでした。PrivateTmpをコメントアウトしてやると、
systemdでconsul-templateを動かすことができるようになりました。

Conclusion
----------

systemdは管理下のプロセスをcgroupsによる分類を行うことで各サービスのリソースの制御を行っているわけですが、
プロセス間で情報をやり取りする場合は `/tmp` を使います。ただ、`/tmp` はサービスと関係のないプロセスからも参照できるので
各サービスのみが使う場合は `PrivateTmp=true` を使うことが望ましいでしょう。
consul-templateはmiddlewareのconfを書き換えることになるのでsystemdを使う場合は、
middlewareのsystemd service fileで `PrivateTmp=true` になっていないか注意する必要があります。

### Note

今回、Consul導入にあたってChefを使いました。既存のconsul-cookbookを利用しようと
思ったんですが、シンプルじゃなくて使いにくい設計だったので作り直しました。もちろん、Consul WebUI・consul-templateに対応してあります。

https://github.com/linyows/consul-cookbook

### Reference

- Introducing Consul Template - HashiCorp  
    https://hashicorp.com/blog/introducing-consul-template.html
- Systemd入門(5) - PrivateTmpの実装を見る - めもめも  
    http://enakai00.hatenablog.com/entry/20130923/1379927579
- systemd for Administrators, Part XII  
    http://0pointer.de/blog/projects/security.html
