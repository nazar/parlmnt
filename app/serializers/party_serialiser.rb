class PartySerializer < ActiveModel::Serializer
  attributes :id, :name, :short, :count_mps, :count_lords
end