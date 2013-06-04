class MyCommentVotesPresenter

  def initialize(commentable_type, commentable_id, user)
    @commentable_type = commentable_type
    @commentable_id = commentable_id
    @user = user
  end

  def to_json(options)
    result = [].tap do |result|
      votes.each do |vote|
        result << {
          :votable_id => vote.votable_id,
          :vote_flag => vote.vote_flag,
          :vote_flag_to_s => Vote.to_direction(vote.vote_flag)
        }
      end
    end
    {:votes => result}.to_json(options)
  end

  def as_json(options)
    active_model_serializer.new(self).as_json options
  end

  private

  def votes
    if @user
      join = <<-EOF
      inner join comments on
        votes.votable_id = comments.id and votes.votable_type = 'Comment' and comments.commentable_type = '#{@commentable_type}' and comments.commentable_id = #{@commentable_id}
      EOF

      ActsAsVotable::Vote.joins(join).where(:voter_id => @user.id)
    else
      []
    end
  end

end