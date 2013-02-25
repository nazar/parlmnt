/* Update sync to extract csrf-token param from page for sync creates/updates

 */

/* alias away the sync method */
Backbone._sync = Backbone.sync;

/* define a new sync method */
Backbone.sync = function(method, model, success, error) {
  /* only need a token for non-get requests */
  if (method == 'create' || method == 'update' || method == 'delete') {
    /* grab the token from the meta tag rails embeds */
    var auth_options = {};
    auth_options[$("meta[name='csrf-param']").attr('content')] =
                 $("meta[name='csrf-token']").attr('content');
    /* set it as a model attribute without triggering events */
    model.set(auth_options, {silent: true});
  }
  /* proxy the call to the old sync method */
  return Backbone._sync(method, model, success, error);
};