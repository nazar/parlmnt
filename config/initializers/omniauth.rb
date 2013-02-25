Rails.application.config.middleware.use OmniAuth::Builder do
  provider :twitter, 'CONSUMER_KEY', 'CONSUMER_SECRET'
  provider :facebook, '	FACEBOOK_KEY', 	'SECRET', :scope => 'email', :display => 'popup'
  provider :google_oauth2, ENV['GOOGLE_KEY'], ENV['GOOGLE_SECRET'], {:access_type => 'online', :approval_prompt => ''}
end