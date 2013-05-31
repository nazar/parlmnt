class BillSummaryPresenter

  def initialize(bills_relation, root_name, context)
    @bills = bills_relation
    @root_name = root_name
    @context = context
  end

  def to_json(options)
    {}.tap do |result|
      result[@root_name] = bills_to_hash
    end.to_json(options)
  end

  private

  def bills_to_hash
    [].tap do |result|
      @bills.each do |bill|
        result << bill_short_to_hash(bill)
      end
    end
  end

  def bill_short_to_hash(bill)
    bill_atts = [:id, :name, :current_stage_id, :bill_type, :origin, :house, :year, :count_views, :count_posts, :count_stages, :url_details, :bill_updated_at, :cached_votes_up, :cached_votes_down, :cached_votes_score]
    sponsor_atts = [:id, :name, :url_details, :url_photo, :email, :sponsor_type, :count_bills]
    party_atts = [:id, :name, :short, :count_mps, :count_lords]
    stage_atts = [:id, :location, :title, :stage, :stage_url, :stage_date]


    bill_atts.inject({}){|r,a| r.merge(a => bill.send(a)) }.tap do |result|
      result[:sponsors] = [].tap do |sponsor_result|
        bill.sponsors.each do |sponsor|
          sponsor_hash = sponsor_atts.inject({}){|r,a| r.merge(a => sponsor.send(a)) }

          if sponsor.party.present?
            sponsor_hash[:party] = party_atts.inject({}){|r,a| r.merge(a => sponsor.party.send(a)) }
          end

          sponsor_result << sponsor_hash
        end
      end

      result[:summary] = @context.sanitize(bill.bill_summary_body, :tags=>[])

      if bill.current_stage.present?
        result[:current_stage] = stage_atts.inject({}){|r,a| r.merge(a => bill.current_stage.send(a)) }
        result[:current_stage_code] = bill.current_stage.stage_to_code
      end
    end
  end

end