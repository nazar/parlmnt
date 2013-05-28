class User < ActiveRecord::Base

  attr_accessible :name, :email, :avatar, :username, :password, :password_confirmation, :salt, :encrypted_password, :ip, :constituency_id

  acts_as_voter

  has_many :comments

  belongs_to :constituency, :counter_cache => 'count_users'

  validates :username, :uniqueness => true
  validates :email, :uniqueness => true, :if => Proc.new{|u| u.email.present? }

  #scopes

  #class methods

  #instance methods


end
