class CommentSerializer < SafeSerializer

  attributes :id, :body, :score, :username, :children

  def username
    object.user.username
  end

end