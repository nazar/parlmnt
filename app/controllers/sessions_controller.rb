class SessionsController < ApplicationController

  respond_to :json, :xml, :only => [:token]

  def create
    auth = request.env['omniauth.auth']

    @auth = Authorization.find_from_hash(auth).first

    unless @auth.present?
      User.transaction do
        @auth = Authorization.create_from_hash(auth, current_user)
      end
    end

    # Log the authorizing user in.
    self.current_user = @auth.user

    render :text => '<script>window.close()</script>'
  end

  def token
    @user = current_user.present? ? current_user : User.new

    respond_with @user
  end

end
