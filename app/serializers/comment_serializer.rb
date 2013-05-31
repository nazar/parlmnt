class CommentSerializer < SafeSerializer

  attributes :id, :body, :score, :username, :children

  attributes :id, :parent_id, :body , :commentable_id , :commentable_type , :created_at , :score , :cached_votes_up , :cached_votes_down ,
             :cached_votes_score , :depth, :username, :mine

  def username
    object.user.username
  end

  def mine
    object.belongs_to_user?(current_user)
  end

end