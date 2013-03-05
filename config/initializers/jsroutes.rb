JsRoutes.generate!({
  :file => Rails.root.join('app/client/vendor/jsroutes.js'),
  :namespace => 'Routes',
  :exclude => /admin_/
})