class Bill < ActiveRecord::Base

  require 'open-uri'
  require 'importer/bills'

  include BillImporter

  acts_as_votable

  attr_accessible :name, :url_details, :bill_updated_at, :house, :import_status, :summary, :bill_type, :origin, :bill_sponsors, :year, :bill_summary, :bill_documents

  validates_presence_of :house, :url_details, :name, :bill_updated_at
  validates_uniqueness_of :name

  has_many :bill_stages, :dependent => :destroy
  has_many :bill_documents, :dependent => :destroy
  has_many :bill_sponsors, :dependent => :destroy

  has_many :sponsors, :through => :bill_sponsors

  has_many :comments, :class_name => 'Comment', :as => :commentable

  has_one :bill_summary

  belongs_to :current_stage, :foreign_key => :current_stage_id, :class_name => 'BillStage'


  ########
  # scopes
  ########

  class << self

    def find_by_name(name)
      where(:name => name)
    end

    def search_by_term(term)
      where('name like ?', "%#{term}%")
    end

    def find_by_year(year)
      where(:year => year)
    end

    def stage_1
      where(:import_status => 1)
    end

    def stage_2
      where(:import_status => 2)
    end

    def with_api_includes
      includes([{:sponsors => :party}, :current_stage])
    end

    def acts #TODO could be drier
      where('exists (select bill_stages.bill_id from bill_stages
        where bill_stages.bill_id = bills.id
        and bill_stages.location = 3)')
    end

    def bills #TODO could be drier
      where('not exists (select bill_stages.bill_id from bill_stages
        where bill_stages.bill_id = bills.id
        and bill_stages.location = 3)')
    end

  end

  ###############
  # class methods
  ###############

  class << self

  end


  ##################
  # instance methods
  ##################


  def needs_import?(remote_updated)
    (bill_updated_at < remote_updated) || (not (import_status > 1))
  end

  def find_stage_by_title(title)
    bill_stages.find_by_title(title)
  end


end
