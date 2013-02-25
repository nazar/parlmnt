object @bill.first

attributes :id, :name, :bill_type, :origin, :house, :year, :count_views, :count_posts, :count_stages, :url_details, :bill_updated_at, :cached_votes_up, :cached_votes_down, :cached_votes_score

child :sponsors do
  attributes :id, :name, :url_details, :url_photo, :email, :sponsor_type, :count_bills

  child :party do
    attributes :id, :name, :short, :count_mps, :count_lords
  end
end

child :bill_stages => :bill_stages do
  attributes :id, :location, :title, :stage, :stage_url, :stage_date
end

child :current_stage => :current_stage do
  attributes :id, :location, :title, :stage, :stage_url, :stage_date
end

child :bill_summary => :bill_summary do
  attributes :id, :rev, :body
end

child :bill_documents do
  attributes :id, :name, :url_pdf, :url_html, :document_date
end