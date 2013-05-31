class ActsController < BillsController

  def index
    year = params[:year] || DateTime.now.year
    @bills = Bill.acts.search_by_year(year).includes([{:sponsors => [:party]}, :current_stage, :bill_summary])

    bills_responder
  end

end
