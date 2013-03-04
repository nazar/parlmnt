class BillStagesIndexes < ActiveRecord::Migration

  def up
    add_index :bill_stages, :bill_id
  end

  def down
    remove_index :bill_stages, :bill_id
  end

end
