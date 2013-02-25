class CommentsController < ApplicationController

  respond_to :json, :xml, :only => [:index, :last_comments]

  def index
    commentable = get_commentable

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

  def create
    commentable = get_commentable
    if commentable.present? && current_user.present?
      replying_to = params[:parent_id].present? ? Comment.find_by_id(params[:parent_id]) : nil
      comment = Comment.build_from(commentable, current_user, params[:body], replying_to)
      if comment.save
        comment.vote(:voter => current_user, :vote => true)
        render :text => comment_to_hash(comment).to_json
      else
        render :nothing, :status => 401
      end
    else
      render :nothing, :status => 404
    end
  end


  protected


  def get_commentable
    Comment.find_commentable(params[:commentable_type], params[:commentable_id])
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
