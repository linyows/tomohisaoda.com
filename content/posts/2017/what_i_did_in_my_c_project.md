+++
date = "2017-03-07T00:38:00+09:00"
draft = false
title = "Cのプロダクトを作るためにやったこと"
tags = [ "C", "OSS" ]

+++

<style>.hatena-bookmark-button-frame { vertical-align: middle; }</style>

今年に入って [Octopass][octopass]
<iframe style="width:120px;vertical-align:middle;" src="https://ghbtns.com/github-btn.html?user=linyows&repo=octopass&type=star&count=true&size=large" frameborder="0" scrolling="0" width="160px" height="30px"></iframe>
<a href="http://b.hatena.ne.jp/entry/tomohisaoda.com/posts/2017/ease_management_of_linux_server_administrator.html" class="hatena-bookmark-button" data-hatena-bookmark-layout="basic-label-counter" data-hatena-bookmark-lang="ja" data-hatena-bookmark-height="29" title="このエントリーをはてなブックマークに追加"><img src="https://b.st-hatena.com/images/entry-button/button-only@2x.png" alt="このエントリーをはてなブックマークに追加" width="20" height="20" style="border: none;" /></a><script type="text/javascript" src="https://b.st-hatena.com/js/bookmark_button.js" charset="utf-8" async="async"></script>
というプロダクトを公開しました。
それは、Linuxのユーザや権限をGithubのTeamと連携して運用を楽にするというツールでした。

色んな方々のご協力により、多くのRetweetやはてぶいただいたことで、ある程度、
[Octopass][octopass] を必要としそうな人の目に触れたのではないかと思っています。
（Githubのスター数が少ないのは今後の課題）
その中で「すごく便利」「ぜひ導入したい」というフィードバックは、
継続して機能追加していくというモチベーションにつながっていて、非常にありがたいです。

さて、この Octopass は、Linuxユーザ名前解決をするためにの glibc の libnssモジュールをCで実装しています。
cgoやその他の言語でShared Objectを吐き出しても良かったのですが、それだと技術的挑戦が足りないとして、触れてこなかったCに挑戦しました。

ただ、リリース当初、認証や公開鍵を取得する部分はgoで書いていて、１プロジェクトの中に２種類の言語を使って成り立っていましたが、
管理が複雑になることと、同様の実装が2つ存在してしまうことが無駄であることを感じて、
v0.2としてgoの部分をCに置き換えるという作業を行い純粋にCのプロダクトとしました。
そのことで、CIをシンプルにでき、類似の実装をしなくて良くなりましたし、見通しがずいぶん良くなった気がします。

今回、Cのプロダクトを作るにあたって、Cを勉強する以外にどんなことをやったか振り返ってみようと思います。

Clang Format
------------

まず、自分が作るのがlibnssのモジュールなので既存のものをgithubで検索してひたすら読んでみました。
最初に気になったのが、coding styleがバラバラなこと！
有名なプロダクトであっても、あまりこれがスタンダードというものがなく、さあ、どうしようという状態になっていました。

これは [@matsumotory][matsumotory] さんに `clang-format` という整形ツールがあるよという情報を得ました。

- [Clang-Format Style Options][clangformat]

clang-formatを導入すると、基本スタイルというものがあって、
LLVM・Google・Mozilla・Linux... といったそれぞれの流派を選択できる様になっていたのでとても便利でした。

早速適当にformatを定義し（設定は下記）、vimと連携することで保存時にきれいに整形されるという感じになりました。

```conf
# requires clang-format >= 3.6
BasedOnStyle: "LLVM"
IndentWidth: 2
ColumnLimit: 120
BreakBeforeBraces: Linux
AllowShortFunctionsOnASingleLine: None
SortIncludes: false
AlignConsecutiveAssignments: true
AlignTrailingComments: true
AllowShortBlocksOnASingleLine: true
```

また、もし仮に Pull-Requestをもらった時に指定するフォーマットから外れていたら、
私やPull-Requestをくれた方にわかる様、CIで formatのdiffをチェックするようにもしました。

Criterion
---------

次に、Unit Test。色々Cのプロジェクト見ていると、main書いて最低限のテストを書いてたり、
自前でassertion作ってたりといて結構カオスです。
何かしらtest frameworkはないかなと調べると良さそうなものがいくつかあります。

- CUnit
- googletest
- Unity
- Criterion

真面目に比較する時間はなかったのでexampleが多いものと出力が分かりやすいものをとりあえず使ってみようと [Criterion][criterion] を使い始めました。

```c
#include <criterion/criterion.h>

Test(suite_1, failing) {
    cr_assert(0);
}

Test(suite_1, passing) {
    cr_assert(1);
}
```

[Criterion][criterion] は結構便利で 色々な `assertion` が準備されてるのはもちろんですが、
異常系のテストとして exit codeや signalを検証する仕組みもあります。
これは、[Criterion][criterion] がテストケースのプロセスを分離して実行結果をレポートする仕組みによるものです。
また、Theoryテストを簡単にやれたりテストスイートを楽に設定できるのもメリットなのかなと（他のフレームワークを使って比較してないので）想像しています。

- [Test Examples][example]
- [Assertion reference - Criterion 2.3.0 documentation][assertion]

Makefile
--------

次に、テストを頻繁に実行しだすとコンパイルしてテスト実行というのが面倒になってきます。
そうすると [GNU Make][make] の出番で、ビルドやビルドに必要な依存ライブラリ等をセットアップすることを定義していきます。
そして、[Make][make] の自己文書化という裏技があるようなので導入しました。簡単に言えば [Make][make] で `rake -T` みたいなことができます。

- Makefileを自己文書化する  
  http://postd.cc/auto-documented-makefile/

```make
pkg: ## Create some distribution packages
	rm -rf builds && mkdir builds
	docker-compose up

dist: ## Upload archives on Mac
	@test -z $(GITHUB_TOKEN) || $(MAKE) github_release
	@test -z $(PACKAGECLOUD_TOKEN) || $(MAKE) packagecloud_release

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(INFO_COLOR)%-30s$(RESET) %s\n", $$1, $$2}'
```

ターゲット名の後ろにコメントを書くことでそれらがターゲットの一覧となるようにしています。

Packaging
---------

プロダクトが完成すると、使いやすくするために、パッケージにしたくなってきます。
そのパッケージ化を手でやってたら面倒なので `docker-compose up` で一気に作成されるようにします。

```yml
rpm:
  dockerfile: dockerfiles/Dockerfile.centos
  build: .
  volumes:
    - .:/octopass
  command: make rpm
deb:
  dockerfile: dockerfiles/Dockerfile.ubuntu
  build: .
  volumes:
    - .:/octopass
  command: make deb
```

また、作成済みパッケージをGithub Rereasesにアップロードするのはおなじみ `ghr` を使い、
[PackageCloud][packagecloud] へのアップロードは `github.com/mlafeldt/pkgcloud` を使用しました。
そうすることで、各ディストリビューションパッケージの作成公開を `make dist` というコマンドだけで完結してしまいます。

Integration Test
----------------

ユニットテストしか書いてなかったので、いざ作ったパッケージをインストールして試したら
`Segmentaion fault` とか出たりして統合テストが出来てなかったことに気づきBashで書きました。

```sh
function test_octopass_passwd() {
  actual="$(/usr/bin/octopass passwd linyows)"
  expected="linyows:x:74049:2000:managed by octopass:/home/linyows:/bin/bash"

  if [ "x$actual" == "x$expected" ]; then
    pass "${FUNCNAME[0]}"
  else
    fail "${FUNCNAME[0]}" "$expected" "$actual"
  fi
}

function run_test() {
  self=$(cd $(dirname $0) && pwd)/$(basename $0)
  tests="$(grep "^function test_" $self | sed -E "s/function (.*)\(\) \{/\1/g")"
  for t in $(echo $tests); do
    $t
  done
}

run_test
exit $ALL_PASSED
```

今回は統合テストの検証項目が少ないためさっとbashで書いてしまいましたが、[Criterion][criterion] で出来たかもしれません。

Conclution
----------

Cのプロダクトを作る際にやったことをまとめると以下です。

- スタイルフォーマット > Clang Format
- Unit Test > Criterion
- 色々自動化 > Makefile
- パッケージ作成 > Dokcer Compose と ghr
- Integration Test > bashで書いた..

これらを抽象化すると、Cスターターみたいなものが出来るなと思いつつ、
[Criterion][criterion] のような便利なツール使うだけで、Cの開発苦手だなーという意識が変わって、
随分前向きで楽しくなるものだなというのを改めて思いました。

Cは勉強始めたばかりなので、メモリの気持ちが理解できるようにやっていくぞ！

- - -

### おまけ

ちなみに、[Octopass][octopass] v0.3では共有ユーザ機能を追加しています。
指定したユーザをチームで共有し認証することができるというものです。
ユースケーストしては、アプリなどの実行またはdeployのためのユーザを共有するのを想定しています。

[Octopass][octopass] はキャッシュすることで、高速さとGithubというSPOFを避けていますが、サーバの台数が大規模になると、
どうしてもGithubのAPI Rate limitを超えAPIの手前にproxyを設置してリクエスト回数を減らすという施策が必要になってきます。
今後は、そのキャッシュを[Octopass][octopass] クラスタ間で共有することでGithub APIのproxyを不要にしようと考えています。
実際にキャッシュを共有するのは、[Etcd][etcd] や [Consul Key/Value Data][consul] とかを使う感じになるイメージです。

[octopass]: https://github.com/linyows/octopass
[matsumotory]: https://twitter.com/matsumotory
[clangformat]: https://clang.llvm.org/docs/ClangFormatStyleOptions.html
[criterion]: https://github.com/Snaipe/Criterion
[example]: https://github.com/Snaipe/Criterion/tree/bleeding/samples
[assertion]: http://criterion.readthedocs.io/en/master/assert.html#base-assertions
[make]: https://www.gnu.org/software/make
[packagecloud]: https://packagecloud.io/
[etcd]: https://github.com/coreos/etcd
[consul]: https://www.consul.io/intro/getting-started/kv.html
