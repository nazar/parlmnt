class BillStageSerializer < ActiveModel::Serializer
  attributes :id, :location, :title, :stage, :stage_url, :stage_date
end