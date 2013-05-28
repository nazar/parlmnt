class UserSerializer < SafeSerializer
  attributes :name, :username, :email, :constituency_id
end
