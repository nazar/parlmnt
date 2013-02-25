set :application, 'parlmnt'
set :use_sudo,    false

set :repository, 'git@github.com:nazar/parlmnt.git'
set :user, 'nazar'

set :deploy_to, "/var/www/rails/#{application}"
set :deploy_via, :remote_cache

set :group, 'www-data'
set :keep_releases, 8
set :copy_exclude, ['.git/*']


set :scm, 'git'

desc 'Run tasks in production environment.'
task :production do

  domain = 'parlmnt.com'
  role :app, domain
  role :web, domain
  role :db,  domain, :primary => true

  set :branch, 'production'
end

desc 'Run tasks in staging environment.'
task :staging do  
  domain = 'staging.parlmnt.com'
  role :app, domain
  role :web, domain
  role :db,  domain, :primary => true

  set :branch, 'staging'

  set :rails_env, 'staging'
end

namespace :deploy do

  task :start, :roles => :app do
    run "touch #{current_release}/tmp/restart.txt"
  end

  task :stop, :roles => :app do
    # Do nothing.
  end

  desc 'Restart Application'
  task :restart, :roles => :app do
    run "touch #{current_release}/tmp/restart.txt"

    #spin up the app
    run 'wget -O --no-check-certificate /dev/null http://panthersoftware.com'
  end

end



namespace :bundler do

  task :create_symlink, :roles => :app do
    run "ln -s #{File.join(shared_path, 'bundle')} #{File.join(current_release, 'vendor/bundle')}"
    run "ln -s #{File.join(shared_path, 'cache')} #{File.join(current_release, 'vendor/cache')}"
  end

  task :bundle_new_release, :roles => :app do
    bundler.create_symlink

    release_dir = File.join(current_release, 'vendor/bundle')

    run "cd #{release_path} && bundle install --without development test --path #{release_dir}"
  end

end


namespace :assets do

  task :compile_sass, :roles => :app do
    run "cd #{current_release} && bundle exec rake assets:precompile"
  end

end

after('deploy:finalize_update') do
  run "rm -rf #{current_release}/log"
  run "ln -s #{deploy_to}/#{shared_dir}/log #{current_release}/log"

  #copy configs
  run "cp #{deploy_to}/#{shared_dir}/res/database.yml #{current_release}/config/database.yml"
  run "cp #{deploy_to}/#{shared_dir}/res/secret_token.rb #{current_release}/config/initializers/secret_token.rb"
end

after 'deploy:update', 'deploy:cleanup'

after 'deploy:finalize_update', 'bundler:bundle_new_release'
after 'deploy:finalize_update', 'assets:compile_sass'