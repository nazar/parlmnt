define([
  'sandbox',

  'widgets/sponsor/main',
  'widgets/bill/main',

  'widgets/sidebar/main',
  'widgets/summary/main',

  'modules/common/shared_global_init',
  'modules/common/sponsor_pub_sub_init'

], function (sandbox, sponsorWidget, billWidget, sidebarWidget, summaryWidget, globalInit, pubSubInit)  {


  return function() {
    var sponsors, sidebar, summary;

    globalInit();

    //filter side bar
    sidebar = sidebarWidget({
      "el": '#sidebar',
      "channel": 'billFilterBar',
      "choices": {
        "Sort by": {
          "type": 'pick',
          "section": 'sort',
          "default": 'first_name',
          "items": {
            "first_name": {
              "icon": '/assets/name.png',
              "tip": 'Sort by First Name'
            },
            "last_name": {
              "icon": '/assets/name.png',
              "tip": 'Sort by Last Name'
            },
            "bill_count": {
              "icon": '/assets/bill.png',
              "tip": 'Sort by Bill numbers'
            },
            "popular": {
              "icon": '/assets/popular.png',
              "tip": 'Sort by Popularity'
            }
          }
        },

        "Major Political Parties": {
          "type": 'toggle',
          "section": 'party',
          "items": {
            "Con": {
              "code": 'party-conservative',
              "tip": 'Conservatives',
              "cssClass": 'conservative'
            },
            "Lab": {
              "code": 'party-labour',
              "tip": 'Labour',
              "cssClass": 'labour'
            },
            "Ldm": {
              "code": 'party-liberal-democrat',
              "tip": 'Liberal Democrats',
              "cssClass": 'ldm'
            }
          }
        },

        "MPs Visibility": {
          "type": 'toggle',
          "section": 'visibility',
          "items": {
            "Show un-billed": {
              "code": 'show_unbilled',
              "tip": 'Show MPs that have not sponsored a Bill'
            }
          }
        },

        "Filter Bill Titles": {
          "type": 'search',
          "section": 'nameFilter',
          "items": {
            "name": {
              "cssClass": 'input-medium',
              "placeholder": 'Search MPs by Name',
              "events": {
                "keyup": function(e) {
                  var $this = $(e.target),
                    term = $this.val().toLowerCase(),
                    ignore = [37, 39];

                  if (ignore.none(e.which) ) {
                    sandbox.publish('SponsorSearchName', term);
                  }
                }
              }
            }
          }
        }
      }
    });

    summary = summaryWidget({el: '#sponsors-summary'});

    sponsors = sponsorWidget({
      el: '#sponsors',
      sponsorType: 'MP',
      collectionRootPath: sandbox.routes.mps_path,
      commentsPath: sandbox.routes.comments_mp_path
    });

    billWidget({
      commentsPath: sandbox.routes.comments_mp_path
    });

    summary.render().startLoader();

    pubSubInit({
      summary: summary,
      sponsors: sponsors
    });


  }




});