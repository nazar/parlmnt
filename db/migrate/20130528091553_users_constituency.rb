class UsersConstituency < ActiveRecord::Migration

  def up
    add_column :users, :constituency_id, :integer
    add_index :users, :constituency_id
  end

  def down
    remove_column :users, :constituency_id
  end

end
