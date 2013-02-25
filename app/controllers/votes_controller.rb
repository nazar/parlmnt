class VotesController < ApplicationController

  def create
    votable = Vote.find_votable_for_user(params, current_user)
    vote = {:voter => current_user, :vote => params[:vote][:vote_flag]}

    if votable.present?
      #cater for unvotes, which is triggered by the same vote being cast twice
      if current_user.voted_as_when_voted_for(votable) == (params[:vote][:vote_flag] == 'true' ? true : false)
        votable.unvote(vote)
      else
        votable.vote(vote)
      end

      #columns = %w(cached_votes_up cached_votes_down) #only send back these attributes
      #result = votable.attributes.reduce({}){|r,(k,v)| columns.include?(k) ? r[k] = v: r; r }

      render :text => vote_to_hash(votable).to_json
    else
      render :nothing => true, :status => 404
    end
  end


  protected


  def vote_to_hash(votable)
    {
      :votes_up => votable.cached_votes_up,
      :votes_down => votable.cached_votes_down,
      :votable_score => votable.cached_votes_score,
    }
  end


end
