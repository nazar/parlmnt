class SponsorSerializer < SafeSerializer
  attributes :id, :name, :constituency_name, :party_name, :url_details, :url_photo, :email, :sponsor_type, :count_bills, :count_posts, :cached_votes_score, :voted

  has_many :bills
  has_one :party

  def voted
    if current_user
      Vote.to_direction( current_user.voted_as_when_voted_for(object) )
    end
  end

end