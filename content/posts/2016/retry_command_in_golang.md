+++
date = "2016-01-22T09:30:00+09:00"
title = "リトライコマンドをgoで書いた"
tags = ["monitoring", "golang", "consul"]

+++

サービス監視をしてると、サービス構成によってはどうしても誤検知してしまうことがあります。
みんな大好きなNagiosだと`check_interval`, `retry_interval`, `max_check_attempts` というのを設定できて、
同様にリトライすることで誤検知を防いでいます。

しかし、私はNagiosホストを立てるのが面倒なのとフェールオーバーがやりたいのでConsul（Atlas）やMackerelでサービス監視を行っていて、
それらはNagiosのようなリトライ機能はありません。

Consulでは一定期間・一定回数リトライする機能を要望する issueが立っていて`thinking` のラベルとなっているようですが、
要望の返事としては「スクリプト側で頑張れます、問題ない」となっております。

Retry check interval · Issue #1268 · hashicorp/consul
https://github.com/hashicorp/consul/issues/1268

### Retry Command in Bash

ということで、shell scriptでサッと書いてみました。

```sh
#!/bin/bash

RETRY_COUNT=2
RETRY_INTERVAL=5s
COMMAND=""

usage() {
  echo "Usage: `basename "$0"` [-n $RETRY_COUNT] [-i $RETRY_INTERVAL] [-c]" 1>&2
  echo "  -n: retry count"
  echo "  -i: retry interval"
  echo "  -c: excute command"
  exit 1
}

while getopts n:i:c: OPT; do
  case $OPT in
    "n" ) RETRY_COUNT="$OPTARG" ;;
    "i" ) RETRY_INTERVAL="$OPTARG" ;;
    "c" ) COMMAND="$OPTARG" ;;
      * ) usage ;;
  esac
done

test "$COMMAND" = "" && usage

eval $COMMAND
if [ $? -ne 0 ]; then
  for i in $(seq 1 $RETRY_COUNT); do
    sleep $RETRY_INTERVAL
    eval $COMMAND
    exit_status=$?
    test $exit_status -eq 0 && exit 0
  done
fi

exit $exit_status
```

シンプルでとても短いコードです。

### Retry Command in Go

さらに、遊びで同じ仕様のものをgolangで書いてみました。

linyows/go-retry
https://github.com/linyows/go-retry

#### Usage

```sh
$ retry -i 5s -c 2 '/usr/lib64/nagios/plugins/check_http -w 10 -c 15 -H localhost'
```

#### Install

```sh
$ go get -d github.com/linyows/go-retry
```

ビルド済みのものをgithub releasesに上げてますので、実際監視で利用する場合はそちら
からdownloadして使うのが便利です。

https://github.com/linyows/go-retry/releases

```sh
$ wget https://github.com/linyows/go-retry/releases/download/v0.1.0/linux_amd64.zip
$ unzip linux_amd64.zip && rm linux_amd64.zip
```

また、これは先日紹介した consul-cookbook の中にレシピを追加しているので consul使
う人はこのcookbookを使うと大変便利じゃないでしょうか。

https://github.com/linyows/consul-cookbook/blob/master/recipes/retry.rb

"わたし、諦めない！" ... じゃないですが、誤検知でお困りの方は使うと便利なコマン
ドの紹介でした。

### Reference

- わたし、諦めない! - golangの場合 | おそらくはそれさえも平凡な日々  
    http://www.songmu.jp/riji/entry/2015-07-06-go-retry.html
- わたし、諦めない! - Sub::Retry - tokuhirom blog  
    http://blog.64p.org/entry/20110113/1294920074
