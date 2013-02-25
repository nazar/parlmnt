class BillDocumentsDocDate < ActiveRecord::Migration

  def up
    add_column :bill_documents, :document_date, :datetime
  end

  def down
    remove_column :bill_documents, :document_date
  end

end
