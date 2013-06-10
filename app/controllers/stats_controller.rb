class StatsController < ApplicationController

  def bills
    json_responder( BillsStatsPresenter.new.bills.to_json )
  end

  def acts
    json_responder( BillsStatsPresenter.new.acts.to_json )
  end

  def bills_acts
    json_responder( BillsStatsPresenter.new.bills_and_acts.to_json )
  end

  def mps
    json_responder( Party.select('name, count_mps count').where('count_mps > 1').to_json )
  end

  def lords
    json_responder( Party.select('name, count_lords count').where('count_lords > 1').to_json )
  end

end
