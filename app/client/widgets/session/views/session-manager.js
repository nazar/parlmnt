define([
  'sandbox',

  'widgets/session/models/user'
],

  function (sandbox, UserModel) {

    var SessionManagerView = sandbox.mvc.View({

      events: {
        "click a#register": '_register'
      },

      initialize: function () {
        this.model = new UserModel();

        this.model.on('change:loggedIn', this.render, this);
      },

      render: function () {
        if (this.model.isRegistered()) {
          this.$el.html(this._renderRegisteredUser());
        } else {
          this.$el.html(this._renderAnonymousUser());
          this._initRegister();
        }

        return this;
      },

      /////// PUBLIC ////

      reload: function() {
        this.model.getMyDetails();
      },

      username: function() {
        return this.model.get('name');
      },

      avatar: function() {
        return this.model.get('avatar');
      },

      loggedIn: function() {
        return this.model.get('name').length > 0;
      },

      startRegisteration: function() {
        this._$modal.modal('show');
      },

      //// PRIVATE ////

      _renderRegisteredUser: function() {
        var $result;

        sandbox.template.render('session/templates/registered', this.model.toJSON(), function (o) {
          $result = sandbox.dom.$q(o);
        });


        return $result;
      },

      _renderAnonymousUser: function() {
        var $result;

        sandbox.template.render('session/templates/anonymous', {}, function (o) {
          $result = sandbox.dom.$q(o);
        });

        return $result;
      },

      ///// Event Handlers

      _register: function(e) {
        e.preventDefault();
        this._$modal.modal('show');
      },

      _registering: function(e) {
        var that = this,
          $link = $(e.currentTarget);

        e.preventDefault();

        sandbox.dom.$.popupWindow($link.prop('href'), {
          width: '500',
          height: '300',
          onUnload: function() {
            sandbox.publish('sessionReload');
            that._closeRegisterModal();
          }
        });
      },

      ///// PRIVATE

      _initRegister: function() {
        var that = this;

        if (!this._$modal) {
          sandbox.template.render('session/templates/register', {}, function (o) {
            that._$modal = sandbox.dom.$q(o);

            //hook popup clicks
            that._$modal.find('.auth a').click(that._registering.bind(that))
          });
        }
      },

      _closeRegisterModal: function() {
        if (this._$modal) {
          this._$modal.modal('hide');
        }
      }


    });


    return SessionManagerView;

  });