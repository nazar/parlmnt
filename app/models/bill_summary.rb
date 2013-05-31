class BillSummary < ActiveRecord::Base
  attr_accessible :body, :rev

  belongs_to :bill

  def update_body!(summary)
    self.body = summary
    self.rev = rev + 1
    save!
  end

end
