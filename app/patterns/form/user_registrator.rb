class UserRegistrator

  require 'digest/sha1'
  require 'net/http'
  require 'uri'

  include Virtus

  extend ActiveModel::Naming
  include ActiveModel::Conversion
  include ActiveModel::Validations

  attr_reader :user

  attribute :username, String
  attribute :password, String
  attribute :encrypted_password, String
  attribute :salt, String
  attribute :ip, String

  validates :username, :length => {:minimum => 3}
  validates :password, :length => {:minimum => 6}
  validates :password, :confirmation => true

  validate :not_spammer
  validate :unique_username


  def persisted?
    false
  end

  def save
    if valid?
      persist!
      true
    else
      false
    end
  end

  def to_json(options)
    {:user => {:username => username, :id => @user.id}}.to_json
  end

  private

  def encrypt_password
    self.salt = Digest::SHA1.hexdigest("+--#{random_string(50) + (Time.now + rand(10000)).to_s + random_string(50)}-+")
    self.encrypted_password = Digest::SHA1.hexdigest("--#{salt}--#{password}--")
  end

  def random_string(len)
    rand_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" << "0123456789" << "abcdefghijklmnopqrstuvwxyz"
    rand_max = rand_chars.size
    srand
    ''.tap do |ret|
      len.times{ ret << rand_chars[rand(rand_max)] }
    end
  end

  def persist!
    encrypt_password
    @user = User.create!(:username => username, :salt => salt, :encrypted_password => encrypted_password, :ip => ip)
  end

  def not_spammer
    if Rails.env.production?
      query = "http://www.stopforumspam.com/api?ip=#{ip}&f=json"
      Rails.logger.info "Querying StopForumSpam: #{query}"
      #build http
      uri = URI.parse(query)
      response = Net::HTTP.get_response(uri)
      Rails.logger.info "Queried StopForumSpam: #{response.body}"
      #parse response.body
      parsed = ActiveSupport::JSON.decode(response.body)
      if (parsed['success'] == 1) && parsed['ip'] && (parsed['ip']['appears'] > 0) && ((parsed['ip']['frequency'] > 0))
        errors.add(:ip, 'Cannot register: spammer activity previously detected.')
      end
    end
  end

  def unique_username
    if User.where(:username => username).count(1) > 0
      errors.add(:username, 'has already been taken')
    end
  end

end