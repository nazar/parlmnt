class Sponsor < ActiveRecord::Base

  require 'open-uri'
  require 'importer/sponsors'

  include SponsorImporter

  acts_as_votable

  SPONSOR_TYPES = {
    '1' => 'mp',
    '2' => 'lords',
    '3' => 'lobby',
    '4' => 'ex'
  }


  validates_presence_of :name, :sponsor_type, :import_status
  validates_uniqueness_of :name, :scope => :sponsor_type

  after_create :update_party_counter

  attr_accessible :name, :url_details, :constituency, :sponsor_type, :party, :import_status, :email

  belongs_to :party

  has_many :bill_sponsors
  has_many :bills, :through => :bill_sponsors

  has_many :comments, :class_name => 'Comment', :as => :commentable


  #########
  # scopes
  #########

  class << self

    def mps
      where(:sponsor_type => 1)
    end

    def lords
      where(:sponsor_type => 2)
    end

    def agents
      where(:sponsor_type => 3)
    end

    def not_agents
      where(:sponsor_type => [1,2])
    end

    def stage_1
      where(:import_status => 1)
    end

    def stage_2
      where(:import_status => 1)
    end

    def find_by_name(name)
      where(:name => name)
    end

    #Special by_name finder as sponsors on bills have a different format to the list of either of MPs or Lords
    def find_sponsor_by_name(sponsor)
      #remove titles
      to_find = sponsor.clone.tap do |result|
        [/mr /i, /mrs /i, /dr /i, /ms /i, /miss /i, /sir /i, /rt hon /i].each do |matcher|
          result.gsub!(matcher, '')
        end
      end
      #now find
      find_by_name(to_find)
    end

  end

  ###############
  # class methods
  ###############

  class << self

    def save_converted_sponsor(sponsor_hash, scope)
      sponsor = scope.find_by_name(sponsor_hash[:name]).first_or_initialize(sponsor_hash)
      if sponsor.new_record?
        sponsor.import_status = 1
        sponsor.save!
      end
    end

    def create_sponsor_placeholder(name)
      Sponsor.create(:name => name, :sponsor_type => 4, :import_status => 2)
    end

  end

  ##################
  # instance methods
  ##################


  def sponsor_type_to_s
    Sponsor::SPONSOR_TYPES[sponsor_type.to_s]
  end

  def party_name
    party.name if party.present?
  end

  def party_short_name
    party.short if party.present?
  end


  protected

  def update_party_counter
    if party_id.present?
      case sponsor_type
        when 1;
          Party.update_mp_counter(party, Sponsor.mps.where(:party_id => party_id).count)
        when 2;
          Party.update_lords_counter(party, Sponsor.lords.where(:party_id => party_id).count)
      end
    end
  end

end
