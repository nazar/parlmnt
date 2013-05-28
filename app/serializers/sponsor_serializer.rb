class SponsorSerializer < SafeSerializer
  attributes :id, :name, :constituency_name, :party_name, :url_details, :url_photo, :email, :sponsor_type, :count_bills, :cached_votes_score

  has_many :bills
  has_one :party
end