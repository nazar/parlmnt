class UsersController < ApplicationController

  respond_to :json

  def token
    user = current_user.present? ? current_user : {}

    respond_with user
  end

  def update
    user = current_user.update_attributes(params[:user])

    respond_with user
  end


end
