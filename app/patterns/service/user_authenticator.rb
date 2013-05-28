class UserAuthenticator

  require 'digest/sha1'

  def initialize(user)
    @user = user
  end

  def authenticate(given_password)
    if @user.encrypted_password == encrypt_given_password(given_password)
      @user
    else
      false
    end
  end

  private

  def encrypt_given_password(given_password)
    Digest::SHA1.hexdigest("--#{@user.salt}--#{given_password}--")
  end


end