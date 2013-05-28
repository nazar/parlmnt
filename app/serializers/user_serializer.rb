class UserSerializer < ActiveModel::Serializer
  attributes :name, :username, :email, :constituency_id
end
