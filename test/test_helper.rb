ENV["RAILS_ENV"] = "test"
require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'
require 'shoulda'

class ActiveSupport::TestCase
  # Setup all fixtures in test/fixtures/*.(yml|csv) for all tests in alphabetical order.
  #
  # Note: You'll currently still have to declare fixtures explicitly in integration tests
  # -- they do not yet inherit this setting
  fixtures :all

  # Add more helper methods to be used by all tests here...

  def importer_pages_loader(section, name)
    file_path = Rails.root.join('test', 'pages', section, name)
    if File.exists?(file_path)
      File.open(file_path, 'r').read
    else
      raise "#{file_path} could not be found"
    end
  end

  def load_parties
    load "#{Rails.root}/db/seeds.rb"
  end

end
