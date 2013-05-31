module UkBillImporter

  require 'importer/utils'

  BASE_URL = 'http://services.parliament.uk'

  BILL_TYPES = {:public => 1, :private => 2, :'private members' => 3, :hybrid => 4}
  BILL_ORIGINS = {:commons => 1, :lords => 2}
  BILL_HOUSES = {:commons => 1, :lords => 2, :'royal assent' => 3}

  STAGE_HOUSES = {:commons => 1, :lords => 2, :ra => 3}


  BILLS_HP_URLS = {
      '13' => 'http://services.parliament.uk/bills/2012-13.html',
      '12' => 'http://services.parliament.uk/bills/2010-12.html',
      '10' => 'http://services.parliament.uk/bills/2009-10.html',
      '09' => 'http://services.parliament.uk/bills/2008-09.html',
      '08' => 'http://services.parliament.uk/bills/2007-08.html'
  }

  BILLS_HP_YEAR_MAP = {
      '2013' => '13',
      '2012' => '13',
      '2011' => '12',
      '2010' => '12',
      '2009' => '10',
      '2008' => '09',
      '2007' => '08'
  }

  BILLS_HP_ORDER = '?group=date&order=desc'


  class BillImporter

    def initialize(year = DateTime.now.year)
      @year = year
    end

    def import
      summaries = BillSummariesImporter.new(@year)
      summaries.import

      Bill.stage_1.each do |bill|
        detail = BillDetailImporter.new(bill)
        detail.import
        #sleep so we don't spam the scraped website
        sleep(3)
      end
    end

  end


  # Service responsible for import Bill Summaries from the Bills index page: http://services.parliament.uk/bills/
  class BillSummariesImporter

    def initialize(year)
      url = BILLS_HP_URLS[BILLS_HP_YEAR_MAP[year.to_s]] << BILLS_HP_ORDER

      @doc = ImporterUtils.safe_fetcher(url)
    end

    def import
      bills_summary_extractor do |bill_summary_hash|
        bills_summary_converter(bill_summary_hash) do |converted|
          save_converted_bill_summary(converted)
        end
      end
    end

    private

    # Process Parliament.uk bills summary page (i.e. http://services.parliament.uk/bills/2012-13.html)
    # and scrapes from each bill row:
    # * bill house (from Current House column)
    # * bill name (from Bill Title column)
    # * url to bill details (from Bill Title column)
    # * last bill update date (from Last Updated column)
    #
    # @yield {:house, :url_details, :name, :bill_updated_at} Hash with scraped keys as string
    # @raise 'Must be passed a block' unless a block is given
    def bills_summary_extractor
      raise 'Must be passed a block' unless block_given?

      @doc.css('table.bill-list tr.tr1, table.bill-list tr.tr2').each do |bill_summary|
        columns = bill_summary.css('td')

        result = {}.tap do |h|
          h[:house] = columns[0].at_css('img')[:title].squish.downcase
          h[:url_details] = columns[1].at_css('a')[:href].squish
          h[:name] = columns[1].at_css('a').text.squish.gsub(/(\[.+\])/,'').strip
          h[:bill_updated_at] = columns[2].text.squish
        end

        yield(result)
      end
    end


    # Process scraped String values (from bills_summary_extractor) and convert:
    # * bill_summary_hash[:house] to Integer code
    # * bill_summary_hash[:bill_updated_at] to to Date
    #
    # @param bill_summary_hash(Hash)
    # @yield {:house => Integer, :bill_updated_at => Date}
    # @raise 'Must be passed a block' unless a block is given
    def bills_summary_converter(bill_summary_hash)
      raise 'Must be passed a block' unless block_given?

      result = bill_summary_hash.clone.tap do |h|
        h[:house] = BILL_HOUSES[bill_summary_hash[:house].to_sym]
        h[:bill_updated_at] = bill_summary_hash[:bill_updated_at].to_datetime
      end

      yield(result)
    end

    def save_converted_bill_summary(bill_hash)
      #take Bill -> Act changes when a bill gains royal assent. Check for Act in title, if so, check existence of a Bill first
      bill_name_has_act = /\sact$/i

      if bill_hash[:name] =~ bill_name_has_act
        bill_name = bill_hash[:name].gsub(bill_name_has_act, ' Bill')
        bill = Bill.find_by_name(bill_name)

        if bill.present?
          #i haz hit. Rename
          bill.name = bill_hash[:name]
        end
      else
        bill = Bill.find_by_name(bill_hash[:name])
      end

      data = bill_hash.merge(:import_status => 1, :year => bill_hash[:bill_updated_at].year)

      if bill.blank?
        Bill.create(data)
      else
        if bill.bill_updated_at < bill_hash[:bill_updated_at]
          bill.update_attributes(data)
        end
      end
    end

  end





  # Service responsible for Importing a specific bill's details from the bill detail page. i.e. http://services.parliament.uk/bills/2013-14/ageofcriminalresponsibility.html
  class BillDetailImporter

    def initialize(bill)
      uri = BASE_URL + bill.url_details

      @bill = bill
      @doc = ImporterUtils.safe_fetcher(uri)
    end

    def import
      bill_detail_extractor do |extracted|
        bill_detail_converter(extracted) do |converted|
          #bill summary from detail page
          @bill.assign_attributes(converted)

          #stages + latest stage
          import_stages_for_bill

          @bill.bill_stages.completed.latest.first.tap do |last_stage|
            if last_stage.present?
              @bill.current_stage_id = last_stage[:id]
            end
          end
          #mark detail import complete by setting import_status = 2
          @bill.import_status = 2
          #\o/ - save!
          @bill.save!
        end
      end
    end

    private

    def import_stages_for_bill
      stages_extractor do |extracted|
        stages_converter(extracted) do |converted|
          @bill.find_stage_by_title(converted[:title]).first_or_initialize.tap do |stage|
            stage.assign_attributes(converted.merge(:bill => @bill))
            stage.save!
          end
        end
      end
    end


    # Scrapes textual data from a bill page and returns String scraped data. This data is not transformed (i.e. named entities not converted to IDs)
    # gets following details:
    # * type of bill
    # * sponsor
    # * summary
    # * documents
    #
    #
    # @yield {:bill_type, :origin, :sponsors => Array, :summary, :documents => Array} as String
    # @raise 'Must be passed a block' unless a block is given    #TODO convert string into Exception class
    def bill_detail_extractor
      raise 'Must be passed a block' unless block_given?

      result = {}.tap do |h|
        h[:bill_type] = @doc.at_css('.bill-agents dd:first').text.squish
        h[:origin] = @doc.at_css('.diagram h2').text.squish
        h[:sponsors] = extractor_bill_detail_sponsors
        h[:summary] = extractor_bill_detail_summary
        h[:documents] = extractor_bill_detail_documents
      end

      yield(result)
    end

    # Converts scraped text into system entities
    #
    # @param [Hash] data is a hash produced from bill_detail_extractor
    # @yield {:bill_type, :origin, :bill_sponsors, :bill_summary, :bill_documents}
    # @raise 'Must be passed a block' unless a block is given     #TODO convert string into Exception class
    def bill_detail_converter(data)
      raise 'Must be passed a block' unless block_given?

      result = {}.tap do |h|
        h[:bill_type] = converter_bill_type(data[:bill_type])
        h[:origin] = converter_origin(data[:origin])
        h[:bill_sponsors] = converter_bill_sponsors(data[:sponsors]) if data[:sponsors]
        h[:bill_documents] = converter_bill_documents(data[:documents])

        #this is a has_one... so don't generate a hash as it will always replace
        converter_bill_summary(data[:summary])
      end

      yield(result)
    end


    #Scrapes the bill summary from Bill Detail Page: i.e. http://services.parliament.uk/bills/2013-14/ageofcriminalresponsibility.html
    #
    #@return String - Scraped Bill Summary
    #@raise String when the summary could not be extracted
    def extractor_bill_detail_summary
      #xpaths to query for summary text
      qs = ['//*[@id="bill-summary"]/h2[3]/following-sibling::*',
            '//*[@id="bill-summary"]/h2[3]/following-sibling::text()',
            '//*[@id="bill-summary"]/h2[2]/following-sibling::text()',
            '//*[@id="bill-summary"]/h2[text()="Summary of the Bill"]/following-sibling::*',
            '//*[@id="bill-summary"]/h2[text()="Summary of the Bill"]/following-sibling::text()'
      ]
      content = nil

      qs.each do |query|
        content = @doc.xpath(query)
        if (content.length > 0) || ((content.length == 1) && (content.text.strip.length > 0))
          break
        end
      end

      if content.length == 0
        raise "Could not extract summary for #{url_details}"      #TODO convert string into Exception class
      end

      ''.tap do |result|
        content.each do |e|
          txt = e.inner_html.blank? ? e.text.squish : e.inner_html.squish
          result << txt
        end
      end
    end

    #Extracts Sponsors from Bill Detail Page
    # 1. Public bills have MP sponsors
    # 2. Private bills sponsored by agents - another word for lobbyists?
    #
    #@return [Array] - Array of sponsors as Strings
    def extractor_bill_detail_sponsors
      #determine private/public
      test = @doc.css('.bill-agents dt')[1]
      if test && test.text.squish.match(/sponsor/i)
        @doc.css('.bill-agents dd')[1..-1].collect{|c| c.text.lines.first.squish}
      elsif test
        [@doc.css('.bill-agents dd')[1].text.squish]
      end
    end



    #Scrapes textual data from the Bill's stages page, i.e. http://services.parliament.uk/bills/2013-14/ageofcriminalresponsibility/stages.html
    #
    #@yield [Hash] - {:title, :stage_url, :stage_date, :location, :stage}
    #@raise 'Must be passed a block' unless a block is given     #TODO convert string into Exception class
    def stages_extractor
      raise 'Must be passed a block' unless block_given?

      doc = ImporterUtils.safe_fetcher(url_details_stages_uri)

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
            h[:location] = STAGE_HOUSES[$2.squish.downcase.to_sym]
          elsif h[:title] =~ /Royal Assent/i
            h[:stage] = 'Royal Assent'
            h[:location] = 3
          else
            Rails.logger.fatal "Could not extract stage and house from #{h[:title]} #{@bill.url_details}"
          end
        end

        yield(result)
      end
    end


    #Extracts a Bill's documents from the Bill's documents page .i.e. http://services.parliament.uk/bills/2013-14/ageofcriminalresponsibility/documents.html
    #
    #@return [Array] - Array of documents as Strings
    def extractor_bill_detail_documents
      [].tap do |result|
        if (doc_link = @doc.at_css('ul.tight a')) && (href = doc_link[:href])
          ImporterUtils.safe_fetcher("#{BASE_URL}#{href}").css('table.bill-items tr').each do |row|
            document = {}
            #a row can consist of: headers, three columns (house, bill + pdf links, date), three columns (house, bill doc link, date)
            if (columns = row.css('td')).length > 0 #ignore th
              links = columns[1].css('a')
              document[:name] = links[0].content
              document[:url_html] = links[0][:href]
              #link or link + pdf check in second column [1]
              if links.length == 2
                document[:url_pdf] = links[1][:href]
              end
              document[:document_date] = columns[2].content.to_datetime
              result << document
            end
          end
        end
      end
    end


    #Converts a scraped String bill type into an Integer for persistence
    #
    #@param [String] - bill type as string
    #@return [Integer] - as defined in BILL_TYPES
    def converter_bill_type(bill_type_string)
      [ {:test => /Government Bill/i, :result => BILL_TYPES[:public]},
        {:test => /Private Bill/i, :result => BILL_TYPES[:private]},
        {:test => /Private Members/i, :result => BILL_TYPES[:'private members']}
      ].each do |matcher|
        if bill_type_string.match(matcher[:test])
          break matcher[:result]
        end
      end
    end


    #Converts a scraper string bill origin into an Integer for persistence
    #
    #@param [String] - bill origin as string
    #@return [Integer] - as defined in BILL_ORIGINS
    def converter_origin(bill_origin_string)
      [ {:test => /House of Lords/i, :result => BILL_ORIGINS[:lords]},
        {:test => /House of Commons/i, :result => BILL_ORIGINS[:commons]}
      ].each do |matcher|
        if bill_origin_string.match(matcher[:test])
          break matcher[:result]
        end
      end
    end


    #Creates a Sponsor from given Sponsor String array if a named sponsor does not already exist
    #Creates a BillSponsor if one does not already exist against the current @bill
    #
    #@param [Array] - an array of Sponsor as String
    #@return [Array] - of BillSponsor, either created or existing
    def converter_bill_sponsors(sponsors)
      if sponsors
        [].tap do |result|
          sponsors.each do |sponsor_name|
            sponsor = Sponsor.find_sponsor_by_name(sponsor_name).first #TODO revisit if Sponsor.find_sponsor_by_name return is altered

            if sponsor.blank?
              #sponsor no longer exists on the parliament website (i.e. no longer a member or deceased). Create a named placeholder
              Log.error("Could not find #{sponsor_name}. Creating placeholder")
              sponsor = Sponsor.create_sponsor_placeholder(sponsor_name)
            end

            result << @bill.bill_sponsors.where(:sponsor_id => sponsor[:id]).first_or_create!
          end
        end
      end
    end


    #@raise 'Must be passed a block' unless a block is given     #TODO convert string into Exception class
    def stages_converter(stage_hash)
      raise 'Must be passed a block' unless block_given?

      result = stage_hash.clone.tap do |h|
        begin
          h[:stage_date] = stage_hash[:stage_date].to_datetime
        rescue
          # stage_date could contain text. Silently ignore
        end
      end

      #only interested in stages that have published URL
      if result[:stage_url].present?
        yield(result)
      end
    end


    def converter_bill_summary(summary_body)
      if summary_body.present?
        if @bill.bill_summary.present?
          if @bill.summary_changed?(summary_body)
            @bill.update_summary(summary_body)
          end
        else
          @bill.create_bill_summary(:body => summary_body, :rev => 0)
        end
      end
    end

    #Creates a BillDocument from given document string Array
    #
    #@return [Array] - of BillDocument, either created or existing
    def converter_bill_documents(documents)
      [].tap do |result|
        documents.each do |document|
          result << @bill.bill_documents.where(:name => document[:name]).first_or_create!(document)
        end
      end
    end

    def url_details_uri
      'http://services.parliament.uk' + @bill.url_details.gsub('.html', '')
    end

    def url_details_stages_uri
      url_details_uri + '/stages.html'
    end

    def url_details_documents_uri
      url_details_uri + '/documents.html'
    end

  end


end

