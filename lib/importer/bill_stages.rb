module BillStagesImporter

  require 'importer/utils'

  STAGE_HOUSES = {
    :commons => 1,
    :lords => 2,
    :ra => 3
  }

  def self.included(base)
    base.extend(BillStagesImporter::ClassMethods)
    base.send :include, BillStagesImporter::InstanceMethods
  end

  module ClassMethods

    def import_stages_for_bill(bill)
      stages_extractor(bill) do |extracted|
        stages_converter(extracted) do |converted|
          bill.find_stage_by_title(converted[:title]).first_or_initialize.tap do |stage|
            stage.assign_attributes(converted.merge(:bill => bill))
            stage.save!
          end
        end
      end
    end

    def stages_extractor(bill, doc = nil)
      raise 'Must be passed a block' unless block_given?

      if doc.nil?
        doc = ImporterUtils.safe_fetcher(bill.url_details_stages_uri)
      end

      doc.css('#bill-summary tr').each do |bill_stage|
        #skip heading row
        next if bill_stage.attributes['class'].value == 'headings'

        #ignore first column
        columns = bill_stage.css('td')[1..-1]

        result = {}.tap do |h|
          #carefull with title as it doesn't always have a link, i.e. stages set for the futures
          columns[0].at_css('a').tap do |title|
            if title.present?
              h[:title] = title.text.squish
              h[:stage_url] = title[:href]
            else
              h[:title] = columns[0].text.squish
            end
          end
          h[:stage_date] = columns[1].text.squish

          if h[:title] =~ /(.+): House of (\w+)/i
            h[:stage] = $1.squish
            h[:location] = BillStagesImporter::STAGE_HOUSES[$2.squish.downcase.to_sym]
          elsif h[:title] =~ /Royal Assent/i
            h[:stage] = 'Royal Assent'
            h[:location] = 3
          else
            Rails.logger.fatal "Could not extract stage and house from #{h[:title]}"
            Log.error "Could not extract stage and house from #{h[:title]}"
          end
        end

        yield(result)
      end
    end

    # @yield [Bill]
    def stages_converter(stage_hash)
      raise 'Must be passed a block' unless block_given?

      result = stage_hash.clone.tap do |h|
        begin
          h[:stage_date] = stage_hash[:stage_date].to_date
        rescue
          # stage_date could contain text. Silently ignore
        end
      end

      #only interested in stages that have published URL
      if result[:stage_url].present?
        yield(result)
      end
    end


  end

  module InstanceMethods

  end



end