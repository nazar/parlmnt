class SponsorIndexSerializer < ActiveModel::Serializer
  attributes :id, :name, :constituency, :count_bills, :count_posts, :cached_votes_score, :party_name, :party_short_name
end