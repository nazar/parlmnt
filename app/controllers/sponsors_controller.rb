class SponsorsController < ApplicationController

  respond_to :json, :xml, :only => [:show]

  def show
    @sponsor = Sponsor.where(:id => params[:id]).includes([:bills])

    respond_with @sponsor
  end


  def comments
    commentable_comments('Sponsor', params[:id])
  end

  protected

  def sponsors_responder(sponsors)
    respond_to do |format|
      format.html
      format.json {render :json => sponsors_to_hash(sponsors)}
      format.xml {render :xml => sponsors_to_hash(sponsors)}
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
    sponsor_att = [:id, :name, :url_details, :url_photo, :email, :sponsor_type, :count_bills, :count_posts,
                   :cached_votes_score, :cached_votes_up,  :cached_votes_down, :sponsor_type_to_s, :party_short_name, :party_name, :updated_at]
    sponsor_att.inject({}){|r,a| r.merge(a => sponsor.send(a)) }
  end


end
