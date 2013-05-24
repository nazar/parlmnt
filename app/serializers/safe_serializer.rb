class SafeSerializer < ActiveModel::Serializer

  def id  #for ruby 1.8.7
    object.read_attribute_for_serialization(:id)
  end

end