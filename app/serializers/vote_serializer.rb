class VoteSerializer < SafeSerializer
  attributes :votable_id, :vote_flag, :vote_flag_to_s

  def vote_flag_to_s
    Vote.to_direction(vote_flag)
  end
end
