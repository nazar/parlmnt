class BillDocument < ActiveRecord::Base

  attr_accessible :name, :url_pdf, :url_html, :document_date

  belongs_to :bill

end
