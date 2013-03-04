JsRoutes.generate!({
  :file => Rails.root.join('app/assets/client/vendor/jsroutes.js'),
  :namespace => 'Routes',
  :exclude => /admin_/
})