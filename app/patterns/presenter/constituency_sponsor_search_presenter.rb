class ConstituencySponsorSearchPresenter

  def initialize(term)
    @term = term
  end

  def to_json(options)
    to_hash.to_json(options)
  end

  def to_hash
    r = [].tap do |result|
      Constituency.where('constituencies.name like ?', "%#{@term}%").
                  order('constituencies.name ASC').
                  includes(:sponsor).each do |constituency|
        if constituency.sponsor.present?
          result << {
              :name => constituency.name,
              :id => constituency.sponsor.id
          }
        end
      end
    end
  end


end