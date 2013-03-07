define([
  'sandbox',

  'widgets/bill/main',

  'modules/common/shared_global_init'

], function (sandbox, billWidget, globalInit)  {


  return function() {

    globalInit();

    billWidget({
      commentsPath: sandbox.routes.comments_mp_path
    });


  }




});