class SearchController < ApplicationController

  def index
    term = params[:term]
    result = {}

    if term.present?
      result['bills'] = Bill.search_by_term(term).order('name ASC')
      result['constituencies'] = ConstituencySponsorSearchPresenter.new(term)
      result['mps'] = Sponsor.mps.search_by_name(term).order_name
      result['lords'] = Sponsor.lords.search_by_name(term).order_name
    end

    respond_to do |format|
      format.json {render :json => result}
    end
  end

end
