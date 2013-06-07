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

end
