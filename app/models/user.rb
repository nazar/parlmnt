class User < ActiveRecord::Base

  acts_as_voter

  has_many :authorizations

  validates_uniqueness_of :email

  attr_accessible :name, :email, :avatar

  #scopes

  class << self

    def find_by_email(email)
      where(:email => email)
    end

  end

  #class methods

  class << self

    def find_or_create_from_hash!(hash)
      info = hash['info']
      find_by_email(info['email']).first_or_create!(:name => info['name'], :avatar => info['image'])
    end

  end

  #instance methods

  def as_json(options = {})
    super( options.merge(:only => [:name, :avatar]) )
  end

end
