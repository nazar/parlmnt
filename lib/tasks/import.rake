namespace :import do

  desc 'Imports and populates all data sources'
  task :all => [:parties, :sponsors, :bills] do

  end

  desc 'Imports Parties'
  task :parties => :environment do
    load "#{Rails.root}/db/seeds.rb"
  end

  desc 'Imports and populates Sponsors'
  task :sponsors => [:parties] do

    #MP summaries
    i = 0
    Sponsor.import_mps_summaries do |converted|
      i += 1
      p "1/4 Importing MPs Summaries #{i} from #{converted[:url_details]}"
    end

    #Lords summaries
    i = 0
    Sponsor.import_lords_summaries do |converted|
      i += 1
      p "2/4 Importing Lords Summaries #{i} from #{converted[:url_details]}"
    end

    #Agents
    i = 0
    Sponsor.import_agents do |converted|
      i += 1
      p "3/4 Importing Agents #{i} from #{converted[:name]}"
    end


    #Sponsor details
    total = Sponsor.stage_1.not_agents.count
    i = 0

    p "Total sponsors: #{total}. Importing details for each"
    Sponsor.stage_1.not_agents.each do |sponsor|
      i += 1
      p "4/4 (#{i} of #{total} - #{((i.to_f/total) * 100).round}%) Importing sponsor details for #{sponsor.sponsor_type_to_s} #{sponsor.name} from #{sponsor.url_details}"
      sponsor.import_details!

      #Don't spam the website... pace
      sleep(2)
      if i % 10 == 0
        sleep(8)
      end
    end

    Setup.last_sponsors_import = Time.now
  end

  desc 'Imports and populates Bills'
  task :bills, [:year]  => :environment do |t, args|

    p args.to_yaml
    p args[:year]

    years = args[:year].present? ? [args[:year]] : ['2007', '2008', '2009', '2010', '2011', '2012']

    #first do summaries
    i = 0
    years.each do |year|
      Bill.import_bills_summaries(year) do |bill_summary|
        i += 1
        p "#{year} - #{i} - Importing Bill Summaries from #{bill_summary[:name]} at #{bill_summary[:url_details]}"
      end
    end

    #then iterate again and import details
    i = 0
    total = Bill.stage_1.count(1)
    Bill.stage_1.each do |bill|
      i += 1
      sleep(3)
      p "(#{i} of #{total} - #{((i.to_f/total) * 100).round}%) Importing bill details for #{bill.name} from #{bill.url_details}"
      bill.import_bill_details
      bill.save!
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