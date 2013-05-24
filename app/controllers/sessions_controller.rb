class SessionsController < ApplicationController

  respond_to :json, :only => [:token, :register, :login]

  def register
    signup = UserRegistrator.new(params[:user].merge(:ip => request.remote_ip))

    if signup.save
      self.current_user = User.find(signup.user.id)
    end

    respond_with(signup, :location => nil)
  end

  def login
    user = User.find_by_username(params[:user][:username])

    if UserAuthenticator.new(user).authenticate(params[:user][:password])
      self.current_user = user
      respond_with(user, :location => nil)
    else
      respond_with({:errors => {:base => 'Invalid username or password'}}, :status => 422, :location => nil)
    end
  end

  def token
    user = current_user.present? ? current_user : {}

    respond_with user
  end

end
