ActiveAdmin.register AdminUser do

  menu :label => 'Administrators'

  filter :email

  index do
    column :email
    # column :current_sign_in_at
    column :last_sign_in_at
    column :sign_in_count
    default_actions
  end

  form do |f|
    f.inputs 'Admin Details' do
      f.input :email
    end
    unless f.object.new_record?
      f.inputs 'Admin Credentials' do
        f.input :password
        f.input :password_confirmation
      end
    end
    f.buttons
  end




end
