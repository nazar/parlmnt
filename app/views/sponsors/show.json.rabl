object @sponsor.first

attributes :id, :name, :url_details, :url_photo, :email, :sponsor_type, :count_bills, :cached_votes_score

child :party do
  attributes :id, :name, :short, :count_mps, :count_lords
end

child :bills do
  attributes :id, :name
end