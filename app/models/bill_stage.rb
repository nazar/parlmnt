class BillStage < ActiveRecord::Base

  STAGES = {
    '1' => 'commons',
    '2' => 'lords'
  }

  belongs_to :bill

  after_create :update_bill_stage_counts
  after_destroy :update_bill_stage_counts

  attr_accessible :title, :stage, :location, :stage_url, :stage_date, :bill


  #scopes

  class << self

    def find_by_title(title)
      where(:title => title)
    end

    def started
      order('stage_date ASC').limit(1)
    end

    def latest
      order('stage_date DESC')
    end

    def completed
      where('stage_url is not null')
    end

  end

  #class methods

  class << self

  end


  #instance methods

  def stage_to_code
    result = ''
    matchers = {
      '1' => /^1st/,
      '2' => /^2nd/,
      '3' => /^3rd/,
      'C' => /^Committee/,
      'A' => /^Royal/,
      'P' => /^Ping/
    }

    if stage
      matchers.each{|(code, matcher)|
        if stage =~ matcher
          result = code
          break
        end
      }
    end
    result
  end

  protected

  def update_bill_stage_counts
    bill.count_stages = BillStage.where(:bill_id => bill.id).count(1)
    bill.save
  end


end
