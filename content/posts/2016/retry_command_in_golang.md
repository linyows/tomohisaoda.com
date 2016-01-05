+++
date = "2016-01-06T10:00:00+09:00"
draft = true
title = "リトライコマンドをgoで書いた"

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
