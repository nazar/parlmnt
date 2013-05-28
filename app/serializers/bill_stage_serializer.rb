class BillStageSerializer < SafeSerializer
  attributes :id, :location, :title, :stage, :stage_url, :stage_date
end