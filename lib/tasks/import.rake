namespace :import do

  desc 'Resets and Imports and populates all data sources'
  task :reset_all => :environment do
    Party.destroy_all
    Constituency.destroy_all
    Sponsor.destroy_all
    Bill.destroy_all
    Comment.destroy_all
    User.destroy_all
  end


  desc 'Imports and populates all data sources'
  task :all => [:sponsors, :bills] do

  end

  desc 'Imports and populates Sponsors'
  task :sponsors => :environment do

    UkSponsorImporter::SponsorImporter.new.import

  end

  desc 'Imports and populates Bills'
  task :bills, [:year]  => :environment do |t, args|

    years = args[:year].present? ? [args[:year]] : [ '2009', '2010', '2011', '2012', '2013']

    years.each do |year|
      UkBillImporter::BillImporter.new(year).import
    end

  end

  desc 'Fix bill current stage'
  task :fix_stages => :environment do
    Bill.all.each do |bill|
      bill.bill_stages.completed.latest.first.tap do |last_stage|
        if last_stage.present?
          bill.current_stage_id = last_stage[:id]
          #also update the year to last stage
          bill.year = last_stage.stage_date.year

          bill.save if bill.changed?
        end
      end
    end

  end



end