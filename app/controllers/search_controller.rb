class SearchController < ApplicationController

  def index
    term = params[:term]
    result = {}

    if term.present?
      #search bills
      result['bills'] = Bill.search_by_term(term).order('name ASC').limit(50)
      #TODO search sponsors (MPs/Lords)
    end

    respond_to do |format|
      format.json {render :json => result}
      format.xml {render :xml => result}
    end
  end

end
