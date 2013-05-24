JsRoutes.generate!({
  :file => Rails.root.join('app/assets/javascripts/jsroutes.js'),
  :namespace => 'Routes',
  :exclude => /admin_/,
  :default_url_options => {:format => "json"}
})