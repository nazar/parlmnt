class CommentsPresenter

  def initialize(commentable_type, commentable_id, current_user)
    @commentable_type = commentable_type
    @commentable_id = commentable_id
    @current_user = current_user
  end

  def to_json(options)
    {:comments => nested_comments_hash(commentable_comments)}.to_json(options.merge(:serializer => CommentSerializer))
  end

  private

  def commentable_comments
    commentable = Comment.find_commentable(@commentable_type, @commentable_id)

    if commentable.present?
      comments = commentable.comments.includes([:user])
    else
      comments = []
    end

    comments.arrange(:order => 'score DESC')
  end

  def nested_comments_hash(comments)
    comments.map do |node, subs|
      comment_to_hash(node).merge(:children => nested_comments_hash(subs).compact)
    end
  end

  def comment_to_hash(comment)
    {
     :id => comment.id,
     :parent_id => comment.parent_id,
     :body => comment.body,
     :commentable_id => comment.commentable_id,
     :commentable_type => comment.commentable_type,
     :created_at => comment.created_at,
     :score => comment.score,
     :cached_votes_up => comment.cached_votes_up,
     :cached_votes_down => comment.cached_votes_down,
     :cached_votes_score => comment.cached_votes_score,
     :depth => comment.depth,
     :username => comment.user.username,
     :mine => comment.belongs_to_user?(@current_user)
    }
  end

end