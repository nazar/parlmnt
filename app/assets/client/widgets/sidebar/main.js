define([
  'sandbox',
  './views/container'
], function (sandbox, SidebarContainer) {

  return function (options) {

    var section = new SidebarContainer({
      "el": sandbox.dom.$q(options.el),
      "choices": options.choices,
      "channel": options.channel
    });

    return section;
  };

});