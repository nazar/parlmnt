class ApplicationController < ActionController::Base

  require 'authenticated_system'
  include AuthenticatedSystem

  protect_from_forgery

  after_filter  :set_csrf_cookie_for_ng   #AngularJS protect_from_forgery

  protected

  def json_responder(obj, options = {})
    respond_to do |format|
      format.json {render({:json => obj}.merge(options))}
    end
  end

  def set_csrf_cookie_for_ng
    cookies['XSRF-TOKEN'] = form_authenticity_token if protect_against_forgery?
  end

  def verified_request?
    super || form_authenticity_token == request.headers['X_XSRF_TOKEN']
  end


end
