class ActsController < BillsController

  def index
    year = params[:year] || DateTime.now.year

    @bills = Bill.acts.find_by_year(year).includes([{:sponsors => [:party]}, :current_stage])

    respond_to do |format|
      format.html
      format.json {render :json => bills_to_hash(@bills)}
      format.xml {render :xml => bills_to_hash(@bills)}
    end
  end

end
