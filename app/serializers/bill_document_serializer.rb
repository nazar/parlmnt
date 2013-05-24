class BillDocumentSerializer < ActiveModel::Serializer
  attributes :id, :name, :url_pdf, :url_html, :document_date
end