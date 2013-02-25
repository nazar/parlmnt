class AdminUser < ActiveRecord::Base

  devise :database_authenticatable,
         :recoverable, :rememberable, :trackable, :validatable,
         :authentication_keys => [:email]

  attr_accessible :email, :password, :password_confirmation, :remember_me

  after_create :send_password

  #instance methods

  def password_required?
    new_record? ? false : super
  end


  protected

  def send_password
    send_reset_password_instructions
  end

end
