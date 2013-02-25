class BillSummary < ActiveRecord::Base
  attr_accessible :body, :rev

  belongs_to :bill

end
