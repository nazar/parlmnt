Rails.application.config.middleware.use OmniAuth::Builder do
  provider :twitter, Setup.twitter_app_key, Setup.twitter_app_secret
  provider :facebook, Setup.facebook_app_key, Setup.facebook_app_secret, :scope => 'email', :display => 'popup'
  provider :google_oauth2, Setup.gmail_app_key, Setup.gmail_app_secret, {:access_type => 'online', :approval_prompt => ''}
end