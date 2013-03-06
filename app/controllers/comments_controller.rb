class CommentsController < ApplicationController

  def create
    commentable = Comment.find_commentable(params[:commentable_type], params[:commentable_id])
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

  def update
    #TODO
  end


end
