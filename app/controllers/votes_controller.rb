class VotesController < ApplicationController

  def create
    votable = Vote.find_votable_for_user(params, current_user)
    vote = {:voter => current_user, :vote => params[:vote][:vote_flag]}

    if votable.present?
      #cater for unvotes, which is triggered by the same vote being cast twice
      if current_user.voted_as_when_voted_for(votable) == (params[:vote][:vote_flag] == 'up' ? true : false)
        votable.unvote(vote)
      else
        votable.vote(vote)
      end

      render :json => vote_to_hash(votable)
    else
      render :nothing => true, :status => 404
    end
  end


  protected


  def vote_to_hash(votable)
    {
      :cached_votes_up => votable.cached_votes_up,
      :cached_votes_down => votable.cached_votes_down,
      :cached_votes_score => votable.cached_votes_score,
      :voted => Vote.to_direction(current_user.voted_as_when_voted_for(votable))
    }
  end


end
