require 'test_helper'

class SponsorTest < ActiveSupport::TestCase

  context "Sponsors scraper" do


    context "MPs" do

      setup do
        load_parties
        @mps_doc = Nokogiri::HTML(importer_pages_loader('sponsors', 'mps.html'))
        @expect = {
          :length => 648
        }
        @tests = [].tap do |result|
          Sponsor.mps_extractor(@mps_doc) do |mp|
            result << mp
          end
        end
      end

      should "scrape MPs" do

        assert_equal @tests.length, @expect[:length]

        @tests.each do |test|
          assert_present test[:name], "name is blank in #{test.inspect}"
          assert_present test[:url_details], "url_details is blank in #{test.inspect}"
          assert_present test[:sponsor_type], "sponsor_type is blank in #{test.inspect}"
          assert_present test[:party_txt], "party_txt is blank in #{test.inspect}"
          assert_present test[:constituency], "constituency is blank in #{test.inspect}"

          assert_equal test[:sponsor_type], 1
        end
      end

      should "convert MPs" do
        @tests.each do |test|
          Sponsor.mp_converter(test) do |mp|
            assert_present mp[:party], "Party is missing from #{mp.inspect}"
          end
        end
      end

      should "save MP summaries" do
        Sponsor.import_mps_summaries(@mps_doc)

        assert_equal Sponsor.mps.count, @expect[:length]
      end

      should "save MP details" do
        Sponsor.import_mps_summaries(@mps_doc)
        Sponsor.import_sponsor_details

        assert_equal Sponsor.mps.stage_2.count, @expect[:length]
      end


    end


    context "Lords" do

      setup do
        load_parties
        @lords_doc = Nokogiri::HTML(importer_pages_loader('sponsors', 'lords.html'))
        @expect = {
          :length => 813
        }
        @tests = [].tap do |result|
          Sponsor.lords_extractor(@lords_doc) do |mp|
            result << mp
          end
        end
      end

      should "scrape Lords" do

        assert_equal @tests.length, @expect[:length]

        @tests.each do |test|
          assert_present test[:name], "name is blank in #{test.inspect}"
          assert_present test[:url_details], "url_details is blank in #{test.inspect}"
          assert_present test[:sponsor_type], "sponsor_type is blank in #{test.inspect}"
          assert_present test[:party_txt], "party_txt is blank in #{test.inspect}"

          assert_equal test[:sponsor_type], 2
        end
      end

      should "convert Lords" do
        @tests.each do |test|
          Sponsor.lord_converter(test) do |mp|
            assert_present mp[:party], "Party is missing from #{mp.inspect}"
          end
        end
      end

      should "save Lord summaries" do
        Sponsor.import_lords_summaries(@lords_doc)

        assert_equal Sponsor.lords.count, @expect[:length]
      end


    end


    context "agents" do

      setup do
        @agents_doc = Nokogiri::HTML(importer_pages_loader('sponsors', 'agents.html'))
        @expect = [
          { :name => 'Bircham Dyson Bell LLP', :url_details => 'www.bdb-law.co.uk', :email => 'pamthompson@bdb-law.co.uk'},
          { :name => 'Eversheds LLP', :url_details => 'www.eversheds.com', :email => 'monicapeto@eversheds.com' },
          { :name => 'Sharpe Pritchard', :url_details => 'www.sharpepritchard.co.uk', :email => 'parliamentary@sharpepritchard.co.uk' },
          { :name => 'Winckworth Sherwood', :url_details => 'www.wslaw.co.uk', :email => 'agorlov@wslaw.co.uk' },
          { :name => 'Berwin Leighton Paisner LLP', :url_details => 'www.blplaw.com', :email => 'Helen.Kemp@blplaw.com' },
          { :name => 'Veale Wasbrough Vizards', :url_details => 'www.vwv.co.uk', :email => 'rperry@vwv.co.uk' },
          { :name => 'Rees & Freres' }
        ].each do |mod|
          mod[:sponsor_type] = 3
          mod[:import_status] = 2
        end
      end


      should "scrape agents" do
        tests = [].tap do |result|
          Sponsor.agents_extractor(@agents_doc) do |agent|
            result << agent
          end
        end

        assert_equal tests.length, @expect.length

        tests.each do |test|
          assert_present test[:name], "name is blank in #{test.inspect}"

          assert_equal test[:sponsor_type], 3
          assert_equal test, @expect[tests.index(test)], "Extracted: #{test.inspect}"
        end
      end

      should "save agents" do
        Sponsor.import_agents(@agents_doc)

        assert_equal Sponsor.agents.count, @expect.length
      end


    end

  end

end
