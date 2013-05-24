class BillDetailSerializer < ActiveModel::Serializer
  attributes :id, :name, :bill_type, :origin, :house, :year, :count_views, :count_posts, :count_stages,
             :url_details, :bill_updated_at, :cached_votes_up, :cached_votes_down, :cached_votes_score,
             :voted

  has_one :current_stage
  has_one :bill_summary

  has_many :sponsors
  has_many :bill_stages
  has_many :bill_documents

  def voted
    if current_user
      Vote.to_direction( current_user.voted_as_when_voted_for(object) )
    end
  end

end
