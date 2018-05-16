theme:
	git clone git@github.com:linyows/hugo-theme-flag.git themes/flag

hugo:
	go get -v github.com/spf13/hugo

deps:
	@which hugo >/dev/null || $(MAKE) hugo
	@test -d themes/flag || $(MAKE) theme

build: deps
	hugo -t flag

server: deps
	hugo server -t flag

.PHONY: default deps theme hugo
