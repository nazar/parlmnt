class CommentsController < ApplicationController

  def create
    commentable = Comment.find_commentable(params[:comment][:commentable_type], params[:comment][:commentable_id])
    if commentable.present? && current_user.present?
      replying_to = params[:comment][:parent_id].present? ? Comment.find_by_id(params[:comment][:parent_id]) : nil
      comment = Comment.build_from(commentable, current_user, params[:comment][:body], replying_to)
      comment.ip = request.remote_ip

      if comment.save
        comment.vote(:voter => current_user, :vote => true)
        render :json => comment
      else
        render :nothing, :status => 401
      end
    else
      render :nothing, :status => 404
    end
  end

  def update
    comment = current_user.comments.find_by_id(params[:id])
    comment.body = params[:comment][:body]
    comment.save

    json_responder(comment)
  end

  def destroy #TODO don't destroy - mark as deleted instead
    comment = current_user.comments.find_by_id(params[:id])
    comment.destroy

    json_responder(comment)
  end

  def reply
    parent_comment = Comment.find_by_id(params[:id])
    commentable = parent_comment.commentable

    if commentable.present? && current_user.present?
      comment = Comment.build_from(commentable, current_user, params[:comment][:body], parent_comment)
      comment.ip = request.remote_ip
      if comment.save
        comment.vote(:voter => current_user, :vote => true)
      end

      json_responder(comment)
    else
      render :nothing, :status => 404
    end
  end

  def my_votes
    my_votes = MyCommentVotesPresenter.new(params[:commentable_type], params[:commentable_id], current_user)
    json_responder(my_votes)
  end


end
