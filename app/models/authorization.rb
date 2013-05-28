class Authorization < ActiveRecord::Base    #TODO remove

  belongs_to :user

  validates_presence_of :user_id, :uid, :provider
  validates_uniqueness_of :uid, :scope => :provider

  attr_accessible :provider, :uid, :user_id, :user


  #scopes

  class << self

    def find_from_hash(hash)
      where(:uid => hash['uid'], :provider => hash['provider'])
    end

  end


  #class methods

  class << self

    def create_from_hash(hash, user = nil)
      user ||= User.find_or_create_from_hash!(hash)
      Authorization.create(:user => user, :uid => hash['uid'], :provider => hash['provider'])
    end


  end

end
