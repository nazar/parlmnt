# Bill related scraping && importing methods.
# The purpose of this module is to separate out scraping && importing logic from the bill.rb model to separate out methods by domain and to reduce clutter.
module BillImporter

  require 'importer/utils'

  BILL_TYPES = {:public => 1, :private => 2, :'private members' => 3, :hybrid => 4}
  BILL_ORIGINS = {:commons => 1, :lords => 2}
  BILL_HOUSES = {:commons => 1, :lords => 2, :'royal assent' => 3}

  BILLS_HP_URLS = {
    '13' => 'http://services.parliament.uk/bills/2012-13.html',
    '12' => 'http://services.parliament.uk/bills/2010-12.html',
    '10' => 'http://services.parliament.uk/bills/2009-10.html',
    '09' => 'http://services.parliament.uk/bills/2008-09.html',
    '08' => 'http://services.parliament.uk/bills/2007-08.html'
  }

  BILLS_HP_YEAR_MAP = {
    '2012' => '13',
    '2011' => '12',
    '2010' => '12',
    '2009' => '10',
    '2008' => '09',
    '2007' => '08'
  }

  BILLS_HP_ORDER = '?group=date&order=desc'




  def self.included(base)
    base.extend(BillImporter::ClassMethods)
    base.send :include, BillImporter::InstanceMethods
  end


  module ClassMethods

    # Imports Bill summaries from Bills listing page. This creates the Bill db entry and must be called to initialise a bill prior to importing its details
    # Imported data:
    # * name
    # * house
    # * url_details
    # * bill_updated_at
    #
    # Bills summary page for 2012 -> http://services.parliament.uk/bills/?group=date&order=desc
    #
    # @param[Number] year [2007 -> 2012]
    # @param[Nokogiri:HTML] doc optional param if a forced nokogiri document is to be supplied ro parsing
    # @yield [Hash] {:name, :house, :url_details, :bill_updated_at}
    def import_bills_summaries(year, doc = nil)
      if doc.nil?
        url = BILLS_HP_URLS[BILLS_HP_YEAR_MAP[year.to_s]] << BILLS_HP_ORDER
        doc = Nokogiri::HTML(open(url))
      end

      bills_summary_extractor(doc) do |bill_summary_hash|
        bills_summary_converter(bill_summary_hash) do |converted|
          yield(converted) if block_given?
          save_converted_bills_summary(converted, year)
        end
      end
    end

    def bills_summary_extractor(doc)
      raise 'Must be passed a block' unless block_given?

      doc.css('table.bill-list tr.tr1, table.bill-list tr.tr2').each do |bill_summary|
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

    def bills_summary_converter(bill_summary_hash)
      raise 'Must be passed a block' unless block_given?

      result = bill_summary_hash.clone.tap do |h|
        h[:house] = BILL_HOUSES[bill_summary_hash[:house].to_sym]
        h[:bill_updated_at] = bill_summary_hash[:bill_updated_at].to_date
      end

      yield(result)
    end

    def save_converted_bills_summary(bill_hash, year)
      #take Bill -> Act changes when a bill gains royal assent. Check for Act in title, if so, check existence of a Bill first
      name_test = /\sact$/i

      if bill_hash[:name] =~ name_test
        bill_name = bill_hash[:name].gsub(name_test, ' Bill')
        bill = where(:name => bill_name).first

        if bill.present?
          #i haz hit. Rename
          bill.name = bill_hash[:name]
        end
      else
        bill = where(:name => bill_hash[:name]).first
      end

      data = bill_hash.merge(:import_status => 1, :year => year)

      if bill.blank?
        Bill.create(data)
      else
        if bill.bill_updated_at < bill_hash[:bill_updated_at]
          bill.update_attributes(data)
        end
      end
    end

  end


  module InstanceMethods

    def import_bill_details(doc = nil)
      if doc.nil?
        uri = 'http://services.parliament.uk' + url_details
        doc = ImporterUtils.safe_fetcher(uri)
        return false unless doc
      end

      bill_detail_extractor(doc) do |extracted|
        bill_detail_converter(extracted) do |converted|
          #bill summary from detail page
          assign_attributes(converted)

          #stages + latest stage
          BillStage.import_stages_for_bill(self)
          bill_stages.completed.latest.first.tap do |last_stage|
            if last_stage.present?
              self.current_stage_id = last_stage[:id]
              #also update the year to last stage
              self.year = last_stage.stage_date.year
            end
          end
        end
        self.import_status = 2
      end
    end

    # Scrapes textual data from bill pages and returns textual scraped data. This data is not transformed (i.e. named entities not converted to IDs)
    # gets following details:
    # * type of bill
    # * sponsor
    # * summary
    #
    # Note that a block is required
    #
    # @param [Object] doc Nokogiri document
    # @yield [:bill_type, :origin, :sponsors, :summary]
    def bill_detail_extractor(doc)
      raise 'Must be passed a block' unless block_given?

      result = {}.tap do |h|
        h[:bill_type] = doc.at_css('.bill-agents dd:first').text.squish
        h[:origin] = doc.at_css('.diagram h2').text.squish
        h[:sponsors] = extractor_bill_detail_sponsors(doc)
        h[:summary] = extractor_bill_detail_summary(doc)
        h[:documents] = extractor_bill_detail_documents(doc)
      end

      yield(result)
    end

    # Converts scraped text into system entities
    #
    # Note that a black is required
    #
    # @param [Hash] data is a hash produced from bill_detail_extractor
    # @yield [:bill_type, :origin, :sponsors]
    def bill_detail_converter(data)
      raise 'Must be passed a block' unless block_given?

      result = {}.tap do |h|
        h[:bill_type] = converter_bill_type(data[:bill_type])
        h[:origin] = converter_origin(data[:origin])
        h[:bill_sponsors] = converter_bill_sponsors(data[:sponsors]) if data[:sponsors]
        h[:bill_summary] = build_bill_summary(:body => data[:summary], :rev => 0) if data[:summary]
        h[:bill_documents] = converter_bill_documents(data[:documents])
      end

      yield(result)
    end

    #extracts summary as text
    def extractor_bill_detail_summary(doc)
      #two xpaths to query for summary text
      qs = ['//*[@id="bill-summary"]/h2[3]/following-sibling::*',
            '//*[@id="bill-summary"]/h2[3]/following-sibling::text()',
            '//*[@id="bill-summary"]/h2[2]/following-sibling::text()',
            '//*[@id="bill-summary"]/h2[text()="Summary of the Bill"]/following-sibling::*',
            '//*[@id="bill-summary"]/h2[text()="Summary of the Bill"]/following-sibling::text()'
      ]
      content = nil

      qs.each do |query|
        content = doc.xpath(query)
        if (content.length > 0) || ((content.length == 1) && (content.text.strip.length > 0))
          break
        end
      end

      if content.length == 0
        raise "Could not extract summary for #{url_details}"
      end

      ''.tap do |result|
        content.each do |e|
          txt = e.inner_html.blank? ? e.text.squish : e.inner_html.squish
          result << txt
        end
      end
    end

    #need to cater for two types of bill ans related sponsors:
    # 1. Public bills have MP sponsors
    # 2. Private bills sponsored by agents - another word for lobbyists?
    def extractor_bill_detail_sponsors(doc)
      #determine private/public
      test = doc.css('.bill-agents dt')[1]
      if test && test.text.squish.match(/sponsor/i)
        doc.css('.bill-agents dd')[1..-1].collect{|c| c.text.lines.first.squish}
      elsif test
        [doc.css('.bill-agents dd')[1].text.squish]
      end
    end

    def extractor_bill_detail_documents(doc)
      [].tap do |result|
        if (doc_link = doc.at_css('ul.tight a')) && (href = doc_link[:href])
          Nokogiri::HTML(open("http://services.parliament.uk#{href}")).css('table.bill-items tr').each do |row|
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
              document[:document_date] = columns[2].content.to_date
              result << document
            end
          end
        end
      end
    end

    def converter_bill_type(text)
      [
        {:test => /Government Bill/i, :result => BillImporter::BILL_TYPES[:public]},
        {:test => /Private Bill/i, :result => BillImporter::BILL_TYPES[:private]},
        {:test => /Private Members/i, :result => BillImporter::BILL_TYPES[:'private members']}
      ].each do |matcher|
        if text.match(matcher[:test])
          break matcher[:result]
        end
      end
    end

    def converter_origin(text)
      [
        {:test => /House of Lords/i, :result => BillImporter::BILL_ORIGINS[:lords]},
        {:test => /House of Commons/i, :result => BillImporter::BILL_ORIGINS[:commons]}
      ].each do |matcher|
        if text.match(matcher[:test])
          break matcher[:result]
        end
      end
    end

    def converter_bill_sponsors(sponsors)
      if sponsors
        [].tap do |result|
          sponsors.each do |sponsor_name|
            sponsor = Sponsor.find_sponsor_by_name(sponsor_name).first

            if sponsor.blank?
              #sponsor no longer exists on the parliament website (i.e. no longer a member or deceased). Create a named placeholder
              Log.error("Could not find #{sponsor_name}. Creating placeholder")
              sponsor = Sponsor.create_sponsor_placeholder(sponsor_name)
            end

            result << bill_sponsors.where(:sponsor_id => sponsor[:id]).first_or_create!
          end
        end
      end
    end

    def converter_bill_documents(documents)
      [].tap do |result|
        documents.each do |document|
          result << bill_documents.where(:name => document[:name]).first_or_create!(document)
        end
      end
    end

    def url_details_stages_uri
      url_details_uri << '/stages.html'
    end

    def url_details_documents_uri
      url_details_uri << '/documents.html'
    end

    def url_details_uri
      'http://services.parliament.uk' + url_details.gsub('.html', '')
    end

  end


end