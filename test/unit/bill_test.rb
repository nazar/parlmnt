require 'test_helper'
require 'nokogiri'
require 'importer/bills'

class BillTest < ActiveSupport::TestCase


  context "Bills data scraper - summaries" do

    setup do
      @bills_doc = Nokogiri::HTML(importer_pages_loader('bills', '2012.html'))

      @tests = [].tap do |result|
        Bill.bills_summary_extractor(@bills_doc) do |extracted|
          result << extracted
        end
      end

      @expect = {
        :length => 104
      }

    end


    should "extract scrape bill summaries" do
      assert_equal @tests.length, @expect[:length]

      @tests.each do |test|
        assert_present test[:house], "missing key :house from #{test.inspect}"
        assert_present test[:url_details], "missing key :url_details from #{test.inspect}"
        assert_present test[:name], "missing key :name from #{test.inspect}"
        assert_present test[:bill_updated_at], "missing key :bill_updated_at from #{test.inspect}"
      end
    end

    should "convert extracted bill summaries" do
      @tests.each do |extracted|
        Bill.bills_summary_converter(extracted) do |converted|
          assert [1,2,3].include?(converted[:house]), "house invalid #{converted[:house]}. Should be either of [1,2,3]"
          assert_present converted[:house], "missing key :house from #{converted.inspect}"
          assert_present converted[:url_details], "missing key :url_details from #{converted.inspect}"
          assert_present converted[:name], "missing key :name from #{converted.inspect}"
          assert_present converted[:bill_updated_at], "missing key :bill_updated_at from #{converted.inspect}"
        end
      end
    end


  end


  context "Bills data scraper - details" do
    include BillImporter


    setup do
      @bill_docs = [
        {:bill => bills(:gb1), :doc => Nokogiri::HTML(importer_pages_loader('bill_details', 'detail_gb1.html'))},
        {:bill => bills(:gb2), :doc => Nokogiri::HTML(importer_pages_loader('bill_details', 'detail_gb2.html'))},
        {:bill => bills(:pm1), :doc => Nokogiri::HTML(importer_pages_loader('bill_details', 'detail_pm1.html'))},
        {:bill => bills(:pm2), :doc => Nokogiri::HTML(importer_pages_loader('bill_details', 'detail_pm2.html'))},
        {:bill => bills(:pv1), :doc => Nokogiri::HTML(importer_pages_loader('bill_details', 'detail_pv1.html'))},
        {:bill => bills(:pv2), :doc => Nokogiri::HTML(importer_pages_loader('bill_details', 'detail_pv2.html'))},
        {:bill => bills(:sp1), :doc => Nokogiri::HTML(importer_pages_loader('bill_details', 'detail_sp1.html'))}
      ]

      @expectation = [
        { :sponsors => ['Mrs Theresa Villiers', 'Earl Attlee'],
          :sponsors_c => [sponsors(:vill), sponsors(:attlee)],
          :bill_type => "Government Bill",
          :bill_type_c => BillImporter::BILL_TYPES[:public],
          :summary => 'information relating toaviation; and for connected purposes.',
          :origin => 'Bill started in the House of Commons',
          :origin_c => BillImporter::BILL_ORIGINS[:commons]
        },
        { :sponsors => ['Mr Kenneth Clarke'],
          :sponsors_c => [sponsors(:clarke)],
          :bill_type => "Government Bill",
          :bill_type_c => BillImporter::BILL_TYPES[:public],
          :summary => 'to replace the common law defences of justification. and fair comment.</li>',
          :origin => 'Bill started in the House of Commons',
          :origin_c => BillImporter::BILL_ORIGINS[:commons]
        },
        { :sponsors => ['Neil Carmichael'],
          :sponsors_c => [sponsors(:neil)],
          :bill_type => "Private Members' Bill (Ballot Bill)",
          :bill_type_c => BillImporter::BILL_TYPES[:'private members'],
          :summary => 'to amend the Antarctic Act 1994; and for connected purposes.',
          :origin => 'Bill started in the House of Commons',
          :origin_c => BillImporter::BILL_ORIGINS[:commons]
        },
        { :sponsors => ['Baroness Campbell of Surbiton'],
          :sponsors_c => [sponsors(:camp)],
          :bill_type => "Private Members' Bill (Starting in the House of Lords)",
          :bill_type_c => BillImporter::BILL_TYPES[:'private members'],
          :summary => 'living for disabled persons by local authorities in England and Wales; and for connected purposes.',
          :origin => 'Bill started in the House of Lords',
          :origin_c => BillImporter::BILL_ORIGINS[:lords]
        },
        { :sponsors => ['Sharpe Pritchard'],
          :sponsors_c => [sponsors(:sharp_bean)],
          :bill_type => "Private Bill",
          :bill_type_c => BillImporter::BILL_TYPES[:private],
          :summary => 'officers to serve fixed penalty notices for street trading offences.</li>',
          :origin => 'Bill started in the House of Commons',
          :origin_c => BillImporter::BILL_ORIGINS[:commons]
        },
        { :sponsors => ['Sharpe Pritchard'],
          :sponsors_c => [sponsors(:sharp_bean)],
          :bill_type => "Private Bill",
          :bill_type_c => BillImporter::BILL_TYPES[:private],
          :summary => 'motorists encroaching into the special advanced stopping boxes set aside for cyclists at busy junctions</li>',
          :origin => 'Bill started in the House of Lords',
          :origin_c => BillImporter::BILL_ORIGINS[:lords]
        },
        { :sponsors => ['Lord Archer of Sandwell', 'Andrew Dismore'],
          :sponsors_c => [sponsors(:lord_sand), sponsors(:and_dis)],
          :bill_type => "Private Members' Bill (Starting in the House of Lords)",
          :bill_type_c => BillImporter::BILL_TYPES[:'private members'],
          :summary => 'The purpose of the Bill is to make provision for action for damages for torture.',
          :origin => 'Bill started in the House of Lords',
          :origin_c => BillImporter::BILL_ORIGINS[:lords]
        }
      ]
    end

    should "scrape and convert bill detail source into a key hash store" do
      @bill_docs.each do |bill_test|
        bill = bill_test[:bill]
        bill_doc = bill_test[:doc]

        bill.bill_detail_extractor(bill_doc) do |extracted|
          test = @expectation[@bill_docs.index(bill_test)]

          assert extracted.present?, "Data was not scraped"

          assert_equal extracted[:sponsors], test[:sponsors], "#{extracted[:sponsors]} vs #{test[:sponsors]}"
          assert_equal extracted[:bill_type], test[:bill_type], "#{extracted[:bill_type]} vs #{test[:bill_type]}"
          assert extracted[:summary].match(test[:summary]), "#{test[:summary]} not matched in #{extracted[:summary]}"
          assert_equal extracted[:origin], test[:origin], "#{extracted[:origin]} vs #{test[:origin]}"
        end
      end
    end

    should "convert scraped text into system entities" do
      @bill_docs.each do |bill_test|
        bill = bill_test[:bill]
        bill_doc = bill_test[:doc]

        bill.bill_detail_extractor(bill_doc) do |extracted|
          test = @expectation[@bill_docs.index(bill_test)]

          bill.bill_detail_converter(extracted) do |converted|
            assert_equal converted[:bill_type], test[:bill_type_c], "#{extracted[:bill_type]} mismatch with #{converted[:bill_type]}. Should be #{test[:bill_type_c]} in #{extracted.inspect}"
            assert_equal converted[:origin], test[:origin_c], "#{extracted[:origin]} mismatch with #{converted[:origin]}. Should be #{test[:origin_c]} in #{extracted.inspect}"

            assert_equal converted[:bill_sponsors].length, extracted[:sponsors].length
            assert_equal converted[:bill_sponsors].collect{|c| c.sponsor.name}, test[:sponsors_c].collect{|c| c.name}, test.inspect
          end
        end
      end
    end
  end



  context "persisting bill data" do

    setup do
      @bill_doc = Nokogiri::HTML(importer_pages_loader('bill_details', 'detail_gb1.html'))
      @bill = bills(:gb1)
      @expect = {
        :count_stages => 30,
        :count_sponsors => 2
      }
    end

    should "import bill stages and latest stages" do
      @bill.import_bill_details(@bill_doc)

      assert_equal @bill.bill_stages.count(1), @expect[:count_stages]
      assert_equal @bill.current_stage_id, @bill.bill_stages.latest.first[:id]

    end



  end







end
