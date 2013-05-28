class TemplatesController < ApplicationController

  def show
    #only interested in xhr requests
    render :template => ['templates', params[:section], params[:view]].join('/') , :layout => false
    #respond_to do |format|
    #  format.js { render :template => ['templates', params[:section], params[:view]].join('/') , :layout => false }
    #end
  end

end
