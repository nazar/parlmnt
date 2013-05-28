class SearchController < ApplicationController

  def index
    term = params[:term]
    result = {}

    if term.present?
      #search bills
      result['bills'] = Bill.search_by_term(term).order('name ASC')
      result['mps'] = Sponsor.mps.search_by_name(term).order_name
      result['lords'] = Sponsor.lords.search_by_name(term).order_name
    end

    respond_to do |format|
      format.json {render :json => result}
      format.xml {render :xml => result}
    end
  end

end
