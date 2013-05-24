class SponsorSerializer < ActiveModel::Serializer
  attributes :id, :name, :constituency, :party_name, :url_details, :url_photo, :email, :sponsor_type, :count_bills, :cached_votes_score

  has_many :bills
  has_one :party
end