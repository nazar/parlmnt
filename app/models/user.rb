class User < ActiveRecord::Base

  attr_accessible :name, :email, :avatar, :username, :password, :password_confirmation, :salt, :encrypted_password, :ip

  acts_as_voter

  has_many :comments

  validates :username, :uniqueness => true
  validates :email, :uniqueness => true, :if => Proc.new{|u| u.email.present? }

  #scopes

  class << self

    def find_by_email(email)
      where(:email => email)
    end

  end

  #class methods


  #instance methods


end
