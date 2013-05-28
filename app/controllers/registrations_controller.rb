class RegistrationsController < ApplicationController

  respond_to :json

  def create
    signup = UserRegistrator.new(params[:user].merge(:ip => request.remote_ip))

    if signup.save
      self.current_user = User.find(signup.user.id)
    end

    respond_with(signup, :location => nil)
  end

end
