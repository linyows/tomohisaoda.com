server ENV['SSH_HOST'], user: ENV['SSH_USER'], roles: %w{app db web}
set :ssh_options, { port: ENV['SSH_PORT'] }
set :branch, 'deploy'
