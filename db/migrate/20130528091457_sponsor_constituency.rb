class SponsorConstituency < ActiveRecord::Migration

  def up
    add_column :sponsors, :constituency_id, :integer
    add_index :sponsors, :constituency_id
  end

  def down
    remove_column :sponsors, :constituency_id
  end

end
