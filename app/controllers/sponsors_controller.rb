class SponsorsController < ApplicationController

#  respond_to :json, :xml, :only => [:show]

  def show
    sponsor = Sponsor.find_by_id(params[:id])
    json_responder(sponsor)
  end


  def comments
    json_responder( CommentsPresenter.new('Sponsor', params[:id], current_user) )
  end

  def my_votes
    votes = current_user ? current_user.find_votes_for_class(Sponsor) : []
    json_responder(votes, :each_serializer => VoteSerializer, :root => 'votes')
  end

  protected

  def sponsors_responder(sponsors)
    respond_to do |format|
      format.json {render :json => sponsors_to_hash(sponsors)}
    end
  end

  def sponsors_to_hash(sponsors)
    [].tap do |result|
      sponsors.each do |sponsor|
        result << sponsor_short_to_hash(sponsor)
      end
    end
  end

  def sponsor_short_to_hash(sponsor)
    sponsor_att = [:id, :name, :constituency, :count_bills, :count_posts, :cached_votes_score, :cached_votes_up,  :cached_votes_down, :party_name]
    sponsor_att.inject({}){|r,a| r.merge(a => sponsor.send(a)) }
  end


end
