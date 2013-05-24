class CommentSerializer < ActiveModel::Serializer

  attributes :id, :body, :score, :username, :children

  def username
    object.user.username
  end

end