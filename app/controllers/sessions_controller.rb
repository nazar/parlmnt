class SessionsController < ApplicationController

  respond_to :json

  def create
    user = User.find_by_username(params[:user][:username])

    if UserAuthenticator.new(user).authenticate(params[:user][:password])
      self.current_user = user
      respond_with(user, :location => nil)
    else
      respond_with({:errors => {:base => 'Invalid username or password'}}, :status => 422, :location => nil)
    end
  end

  def destroy
    self.current_user = nil
    render :nothing => true
  end

end
