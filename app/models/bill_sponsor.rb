class BillSponsor < ActiveRecord::Base

  belongs_to :bill
  belongs_to :sponsor, :counter_cache => 'count_bills'

  attr_accessible :sponsor

end
