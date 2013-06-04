class ActsController < BillsController

  def index
    year = params[:year] || DateTime.now.year
    @acts = Bill.acts.search_by_year(year).includes([{:sponsors => [:party]}, :current_stage, :bill_summary])

    json_responder( BillSummaryPresenter.new(@acts, 'acts') )
  end

end
