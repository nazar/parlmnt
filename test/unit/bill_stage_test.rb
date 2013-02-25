require 'test_helper'

class BillStageTest < ActiveSupport::TestCase

  context "Stages Scraper" do

    setup do
      @stages_doc = Nokogiri::HTML(importer_pages_loader('bill_stages', 'stages1.html'))

      @tests = [].tap do |r|
        BillStage.stages_extractor('blah', @stages_doc) do |extracted|
          r << extracted
        end
      end
      
      @expect = [
        {:stage => '1st reading', :location => 1, :stage_date => '19.01.2012'},
        {:stage => '2nd reading', :location => 1, :stage_date => '30.01.2012'},
        {:stage => 'Money resolution', :location => 1, :stage_date => '30.01.2012'},
        {:stage => 'Carry-over motion', :location => 1, :stage_date => '30.01.2012'},
        {:stage => 'Programme motion', :location => 1, :stage_date => '30.01.2012'},
        {:stage => 'Committee Debate: 1st Sitting', :location => 1, :stage_date => '21.02.2012'},
        {:stage => 'Committee Debate: 2nd Sitting', :location => 1, :stage_date => '21.02.2012'},
        {:stage => 'Committee Debate: 3rd Sitting', :location => 1, :stage_date => '23.02.2012'},
        {:stage => 'Committee Debate: 4th Sitting', :location => 1, :stage_date => '23.02.2012'},
        {:stage => 'Committee Debate: 5th Sitting', :location => 1, :stage_date => '28.02.2012'},
        {:stage => 'Committee Debate: 6th Sitting', :location => 1, :stage_date => '28.02.2012'},
        {:stage => 'Committee Debate: 7th Sitting', :location => 1, :stage_date => '01.03.2012'},
        {:stage => 'Committee Debate: 8th Sitting', :location => 1, :stage_date => '01.03.2012'},
        {:stage => 'Committee Debate: 12th Sitting', :location => 1, :stage_date => '01.03.2012'},
        {:stage => 'Committee Debate: 9th Sitting', :location => 1, :stage_date => '06.03.2012'},
        {:stage => 'Committee Debate: 10th Sitting', :location => 1, :stage_date => '06.03.2012'},
        {:stage => 'Committee Debate: 11th Sitting', :location => 1, :stage_date => '08.03.2012'},
        {:stage => 'Committee Debate: 13th Sitting', :location => 1, :stage_date => '13.03.2012'},
        {:stage => 'Committee Debate: 14th Sitting', :location => 1, :stage_date => '13.03.2012'},
        {:stage => 'Report stage', :location => 1, :stage_date => '25.04.2012'},
        {:stage => 'Programme (no.2) motion', :location => 1, :stage_date => '25.04.2012'},
        {:stage => '1st reading', :location => 1, :stage_date => '10.05.2012'},
        {:stage => '2nd reading', :location => 1, :stage_date => '10.05.2012'},
        {:stage => '3rd reading', :location => 1, :stage_date => '22.05.2012'},
        {:stage => '1st reading', :location => 2, :stage_date => '23.05.2012'},
        {:stage => '2nd reading', :location => 2, :stage_date => '13.06.2012'},
        {:stage => 'Committee: 1st sitting', :location => 2, :stage_date => '27.06.2012'},
        {:stage => 'Committee: 2nd sitting', :location => 2, :stage_date => '02.07.2012'},
        {:stage => 'Committee: 3rd sitting', :location => 2, :stage_date => '04.07.2012'},
        {:stage => 'Committee: 4th sitting', :location => 2, :stage_date => '09.07.2012'}
      ]

    end

    should "scrape bill stages" do
      assert_equal @tests.length, @expect.length

      @tests.each do |test|
        index = @tests.index(test)

        assert_equal test[:stage], @expect[index][:stage], "stage mismatch in #{test.inspect}"
        assert_equal test[:location], @expect[index][:location], "location mismatch in #{test.inspect}"
        assert_equal test[:stage_date], @expect[index][:stage_date], "stage_date mismatch in #{test.inspect}"
      end
    end

  end

end
