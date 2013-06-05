module UkSponsorImporter

  require 'importer/utils'

  URI_MPS = 'http://www.parliament.uk/mps-lords-and-offices/mps/'
  URI_LORDS = 'http://www.parliament.uk/mps-lords-and-offices/lords/'
  URI_AGENTS = 'http://www.publications.parliament.uk/pa/pbagents.htm'

  class SponsorImporter

    def import
      summary = SponsorSummariesImporter.new
      summary.import

      #Sponsor details
      Sponsor.stage_1.not_agents.each do |sponsor|

        detail = SponsorDetailImporter.new(sponsor)
        detail.import
        #Don't spam the website... pace
        sleep(2)
      end
      Setup.last_sponsors_import = Time.now
    end

  end

  class SponsorSummariesImporter

    def import
      import_mps_summaries
      sleep(2)
      import_lords_summaries
      sleep(2)
      import_agents
      sleep(2)
    end


    private


    def import_mps_summaries
      doc = ImporterUtils.safe_fetcher(URI_MPS)

      mps_extractor(doc) do |mp_hash|
        mp_converter(mp_hash) do |converted|
          save_converted_sponsor(converted, Sponsor.mps)
        end
      end
    end

    def import_lords_summaries
      doc = ImporterUtils.safe_fetcher(URI_LORDS)

      lords_extractor(doc) do |lords_hash|
        lord_converter(lords_hash) do |converted|
          save_converted_sponsor(converted, Sponsor.lords)
        end
      end
    end

    def import_agents
      doc = ImporterUtils.safe_fetcher(URI_AGENTS)
      agents_extractor(doc) do |agent_hash|
        Sponsor.agents.find_by_name(agent_hash[:name]).first_or_create(agent_hash)
      end
    end

    def mps_extractor(doc)
      raise "Must be passed a block" unless block_given?

      doc.css('#pnlListing table tr').each do |row|
        columns = row.css('td')

        if columns.length == 2
          details = columns[0]
          constit = columns[1]

          result = {}.tap do |h|
            h[:name] = details.text.squish.gsub(/\(.+\)/, '').split(',').reverse.join.strip
            h[:url_details] = details.at_css('a')[:href].squish
            h[:party_txt] = details.text.squish.match(/\((.+)\)/)[1]
            h[:constituency_name] = constit.text.squish
            h[:sponsor_type] = 1
          end

          yield(result)
        end
      end
    end

    def lords_extractor(doc)
      raise "Must be passed a block" unless block_given?

      doc.css('#pnlListing table tr').each do |row|
        columns = row.css('td')


        if columns.length == 2
          details = columns[0]
          party = columns[1]

          result = {}.tap do |h|
            h[:name] = details.text.squish.split(',').reverse.join(' ').strip
            h[:url_details] = details.at_css('a')[:href].squish
            h[:party_txt] = party.text.squish.gsub(/\(.+\)/, '').strip
            h[:sponsor_type] = 2
          end

          yield(result)
        end
      end
    end

    def agents_extractor(doc)
      raise "Must be passed a block" unless block_given?

      doc.css('td ul').each do |element|

        result = {}.tap do |h|
          h[:name] = element.text.lines.first.squish
          h[:sponsor_type] = 3
          h[:import_status] = 2

          if element.text =~ /Website: (.+)/
            h[:url_details] = $1
          end
          if element.text =~ /E-mail: (.+)/ || element.text =~ /Email:(.+)/
            h[:email] = $1
          end
        end

        yield(result)
      end
    end

    def mp_converter(sponsor_hash)
      raise "Must be passed a block" unless block_given?

      result = sponsor_hash.clone.tap do |h|
        party_name = h.delete(:party_txt)

        h[:party] = Party.where(:short => party_name).first_or_create(:name => party_name)
        h[:constituency_name] = h.delete(:constituency_name)
        h[:constituency_id] = Constituency.where(:name => h[:constituency_name]).first_or_create!.id
      end

      yield(result)
    end

    def lord_converter(sponsor_hash)
      raise "Must be passed a block" unless block_given?

      result = sponsor_hash.clone.tap do |h|
        party_name = h.delete(:party_txt)

        h[:party] = Party.where(:name => party_name).first_or_create
      end

      yield(result)
    end

    def save_converted_sponsor(sponsor_hash, scope)
      sponsor = scope.find_by_name(sponsor_hash[:name]).first_or_initialize(sponsor_hash)
      if sponsor.new_record?
        sponsor.import_status = 1
        sponsor.save!
      else
        sponsor.update_attributes(sponsor_hash)
      end
    end

  end




  class SponsorDetailImporter

    def initialize(sponsor)
      @sponsor = sponsor
    end

    def import
      if import_details
        @sponsor.import_updated_at = Time.now
        @sponsor.save!
      end
    end


    private


    def import_details
      #detail import applies to MPs and Lords only. Agents have no details
      if [1,2].include?(@sponsor.sponsor_type)
        doc = ImporterUtils.safe_fetcher(@sponsor.url_details)
        begin
          @sponsor.url_photo = doc.at_css(img_css_selector)[:src].squish

          #email is not always present
          doc.at_css(email_css_selector).tap do |email|
            @sponsor.email = email.text unless email.nil?
          end

          if @sponsor.url_photo.present?
            @sponsor.import_status = 2
            true
          else
            Rails.logger.fatal "Error IMG parse #{@sponsor.url_details} #{img_css_selector} from #{@sponsor.url_details}.\n"
            Rails.logger.fatal("url_photo was blank for #{@sponsor.name} or #{@sponsor.url_details}. Skipping")
            false
          end
        rescue Exception => e
          Rails.logger.fatal "Exception parsing #{@sponsor.url_details} #{img_css_selector} or #{email_css_selector} from #{@sponsor.url_details}.\n" << "#{e.message}\n" << e.backtrace.join("\n")
          Rails.logger.fatal("Scrape error. url_photo or email was blank for #{@sponsor.name} at #{@sponsor.url_details}. Skipping")
          false
        end
      end
    end

    def img_css_selector
      '#biography .member-photo img'
    end

    def email_css_selector
      '#biography #member-addresses a[href^="mailto"]'
    end

  end


end