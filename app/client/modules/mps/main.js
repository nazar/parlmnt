define([
  'sandbox',

  'widgets/sponsor/main',
  'widgets/bill/main',

  'widgets/sidebar/main',
  'widgets/summary/main',
  'widgets/votable/main',
  'widgets/commentable/main',

  'modules/common/shared_global_init',
  'modules/common/sponsor_pub_sub_init'

], function (sandbox, sponsorWidget, billWidget, sidebarWidget, summaryWidget, votableWidget, commentableWidget, globalInit, pubSubInit)  {


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
          "default": 'name',
          "items": {
            "name": {
              "icon": '/images/name.png',
              "tip": 'Sort by Name'
            },
            "bill_count": {
              "icon": '/images/bill.png',
              "tip": 'Sort by Bill numbers'
            },
            "popular": {
              "icon": '/images/popular.png',
              "tip": 'Sort by Popularity'
            },
            "liked": {
              "icon": '/images/liked.png',
              "tip": 'Sort by Likes'
            },
            "disliked": {
              "icon": '/images/disliked.png',
              "tip": 'Sort by Dislikes'
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
      votableBuilder: votableWidget,
      commentableBuilder: commentableWidget,
      collectionRootPath: sandbox.routes.mps_path,
      commentsPath: sandbox.routes.comments_mp_path
    });

    billWidget({
      votableBuilder: votableWidget,
      commentableBuilder: commentableWidget,
      collectionRootPath: sandbox.routes.bills_path,
      commentsPath: sandbox.routes.comments_bill_path
    });

    summary.render().startLoader();

    pubSubInit({
      summary: summary,
      sponsors: sponsors,
      tracking: 'Viewing Sponsors'
    });


  }




});