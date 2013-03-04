class ApplicationController < ActionController::Base

  require 'lib/authenticated_system'

  include AuthenticatedSystem

  protect_from_forgery

  protected

  def commentable_comments(commentable_type, commentable_ids)
    commentable = Comment.find_commentable(commentable_type, commentable_ids)

    if commentable.present?
      comments = commentable.comments.includes([:user])
    else
      comments = []
    end

    arranged = comments.arrange(:order => 'score DESC') #FIXME: will fail on invalid commentable

    respond_to do |format|
      format.json {render :json => nested_comments_hash(arranged)}
    end
  end

  def nested_comments_hash(comments)
    comments.map do |node, subs|
      comment_to_hash(node).merge(:children => nested_comments_hash(subs).compact)
    end
  end

  def comment_to_hash(comment)
    {:id => comment.id, :parent_id => comment.parent_id, :body => comment.body, :commentable_id => comment.commentable_id,
     :commentable_type => comment.commentable_type, :created_at => comment.created_at, :score => comment.score,
     :cached_votes_up => comment.cached_votes_up, :cached_votes_down => comment.cached_votes_down, :cached_votes_score => comment.cached_votes_score,
     :depth => comment.depth, :user_name => comment.user.name, :avatar => comment.user.avatar}
  end



end
