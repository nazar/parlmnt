module ImporterUtils

  require 'open-uri'

  class << self

    def safe_fetcher(uri)
      tries = 1
      begin
        p "Opening #{uri}"
        Nokogiri::HTML(open(uri))
      rescue OpenURI::HTTPError => ex
        tries = tries + 1
        p "Error fetching from #{uri}. Retry #{tries}. #{ex}"
        if tries < 5
          sleep(5)
          retry
        else
          p "5 failed attempts to open #{uri} - #{ex}"
          return false
        end
      rescue Exception => ex
        p "safe_fetcher unexpected error #{ex.class.name} #{ex.message}" << ex.backtrace.join("\n")
      end
    end

  end


end