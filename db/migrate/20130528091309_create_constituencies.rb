class CreateConstituencies < ActiveRecord::Migration

  def up
    create_table :constituencies do |t|
      t.string :name
      t.integer :count_users, :default => 0

      t.timestamps
    end
  end

  def down
    drop_table :constituencies
  end

end
