class PagesController < ApplicationController

  def landing
    render 'pages/landing', :layout => 'application'
  end

end
