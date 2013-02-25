class ApplicationController < ActionController::Base

  require 'lib/authenticated_system'

  include AuthenticatedSystem

  protect_from_forgery


end
