class SearchController < ApplicationController

  def index
    term = params[:term]
    result = {}

    if term.present?
      #search bills
      result['bills'] = {:result => Bill.search_by_term(term).order('name ASC').limit(15).to_a}
      result['mps'] = {:route => 'sponsors', :result => Sponsor.mps.search_by_name(term).order_name.limit(15).to_a}
      result['lords'] = {:route => 'sponsors', :result => Sponsor.mps.search_by_name(term).order_name.limit(15).to_a}
    end

    respond_to do |format|
      format.json {render :json => result}
      format.xml {render :xml => result}
    end
  end

end
