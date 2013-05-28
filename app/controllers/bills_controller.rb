class BillsController < ApplicationController

  respond_to :json, :xml, :only => [:show]

  def index
    year = params[:year] || DateTime.now.year
    @bills = Bill.find_by_year(year).bills.includes([{:sponsors => [:party]}, :current_stage, :bill_summary])

    bills_responder
  end

  def show
    bill = Bill.find_by_id(params[:id])

    json_responder(bill, :serializer => BillDetailSerializer)
  end

  def comments
    commentable_comments('Bill', params[:id])
  end

  def my_votes
    votes = current_user ? current_user.find_votes_for_class(Bill) : []
    json_responder(votes, :each_serializer => VoteSerializer, :root => 'votes')
  end


  protected

  def bills_to_hash(bills)
    [].tap do |result|
      bills.each do |bill|
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

      result[:summary] = view_context.sanitize(bill.bill_summary.body, :tags=>[])

      if bill.current_stage.present?
        result[:current_stage] = stage_atts.inject({}){|r,a| r.merge(a => bill.current_stage.send(a)) }
        result[:current_stage_code] = bill.current_stage.stage_to_code
      end
    end
  end

  def bills_responder
    respond_to do |format|
      format.json {render :json => bills_to_hash(@bills)}
    end
  end

end