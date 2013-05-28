class TableCleanup < ActiveRecord::Migration

  def up
    drop_table :active_admin_comments
    drop_table :admin_users
    drop_table :authorizations
  end

  def down
  end

end
