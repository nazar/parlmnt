module SponsorImporter #TODO convert into a Service Module as opposed to a mixin

  require 'importer/utils'



  def self.included(base)
    base.extend(SponsorImporter::ClassMethods)
    base.send :include, SponsorImporter::InstanceMethods
  end


  module ClassMethods
    def import_mps_summaries(source = nil)
      doc = source || Nokogiri::HTML(open('http://www.parliament.uk/mps-lords-and-offices/mps/'))

      mps_extractor(doc) do |mp_hash|
        mp_converter(mp_hash) do |converted|
          yield(converted) if block_given?
          save_converted_sponsor(converted, mps)
        end
      end
    end

    def import_lords_summaries(source = nil)
      doc = source || Nokogiri::HTML(open('http://www.parliament.uk/mps-lords-and-offices/lords/'))

      lords_extractor(doc) do |lords_hash|
        lord_converter(lords_hash) do |converted|
          yield(converted) if block_given?
          save_converted_sponsor(converted, lords)
        end
      end
    end

    def import_agents(source = nil)
      doc = source || Nokogiri::HTML(open('http://www.publications.parliament.uk/pa/pbagents.htm'))
      agents_extractor(doc) do |agent_hash|
        yield(agent_hash) if block_given?
        agents.find_by_name(agent_hash[:name]).first_or_create(agent_hash)
      end
    end

    def import_sponsor_details
      total = 1
      stage_1.each do |sponsor|
        # don't DOS their site!!
        sleep(2)
        sponsor.import_details!

        #pause longer every 10 imports
        total += 1
        if total % 10 == 0
          sleep(10)
        end
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
         h[:party] = Party.find_by_name(h.delete(:party_txt)).first
       end

       yield(result)
    end

  end

  module InstanceMethods

    def import_details(doc = nil)
      #detail import applies to MPs and Lords only. Agents have no details
      if [1,2].include?(sponsor_type)

        if doc.nil?
          uri = url_details
          doc = ImporterUtils.safe_fetcher(uri)
          return false unless doc
        end

        begin
          self.url_photo = doc.at_css(img_css_selector)[:src].squish

          #email is not always present
          doc.at_css(email_css_selector).tap do |email|
            self.email = email.text unless email.nil?
          end

          if self.url_photo.present?
            self.import_status = 2
            true
          else
            logger.fatal "Error IMG parse #{url_details} #{img_css_selector} from #{url_details}.\n" << doc.inner_html
            Log.fatal("url_photo was blank for #{name} ar #{url_details}. Skipping")
            false
          end
        rescue Exception => e
          logger.fatal "Exception parsing #{url_details} #{img_css_selector} or #{email_css_selector} from #{url_details}.\n" << doc.inner_html << "#{e.message}\n" << e.backtrace.join("\n")
          Log.fatal("Scrape error. url_photo or email was blank for #{name} at #{url_details}. Skipping", e)
          false
        end
      end
    end

    def import_details!
      if import_details
        self.import_updated_at = Time.now
        save!
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