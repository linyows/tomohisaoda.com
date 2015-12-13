lock '3.4.0'

ENV['USERNAME'] = ENV['WERCKER_STARTED_BY'] if ENV['WERCKER_STARTED_BY']

set :application, 'tomohisaoda.com'
set :repo_url, 'https://github.com/linyows/tomohisaoda.com.git'
ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp
set :deploy_to, ENV['DEPLOY_TO']
set :scm, :git
set :format, :pretty
set :log_level, :info
# set :pty, true
# set :linked_files, fetch(:linked_files, []).push('config/database.yml', 'config/secrets.yml')
# set :linked_dirs, fetch(:linked_dirs, []).push('log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'vendor/bundle', 'public/system')
# set :default_env, { path: "/opt/ruby/bin:$PATH" }
# set :keep_releases, 5
