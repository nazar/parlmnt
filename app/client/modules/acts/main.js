define([
  'sandbox',

  'widgets/sidebar/main',
  'widgets/bill/main',
  'widgets/summary/main',
  'widgets/votable/main',
  'widgets/commentable/main',

  'modules/common/shared_global_init',
  'modules/common/bills_pub_sub_init'

], function (sandbox, sidebarWidget, billWidget, summaryWidget, votableWidget, commentableWidget, globalInit, billsInit)  {


  return function() {
    var bills, sidebar, summary;

    globalInit();

    //filter side bar
    sidebar = sidebarWidget({
      "el": '#sidebar',
      "channel": 'billFilterBar',
      "choices": {
        "Year": {
          "type":  'pick',
          "section":  'year',
          "default": '2013',
          "items": {
            "2013": {
              "tip": 'Acts in 2013'
            },
            "2012": {
              "tip": 'Acts in 2012'
            },
            "2011": {
              "tip": 'Acts in 2011'
            },
            "2010": {
              "tip": 'Acts in 2010'
            }
          }
        },

        "Sort by": {
          "type": 'pick',
          "section": 'sort',
          "default": 'name',
          "items": {
            "name": {
              "icon": '/assets/name.png',
              "tip": 'Sort by Name'
            },
            "last_updated": {
              "icon": '/assets/recent.png',
              "tip": 'Sort by Recent Activity'
            },
            "popular": {
              "icon": '/assets/popular.png',
              "tip": 'Sort by Popularity'
            },
            "liked": {
              "icon": '/assets/liked.png',
              "tip": 'Sort by Likes'
            },
            "disliked": {
              "icon": '/assets/disliked.png',
              "tip": 'Sort by Dislikes'
            }
          }
        },

        "Act Type": {
          "type": 'toggle',
          "section": 'type',
          "items": {
            "Pub": {
              "code": 'pu',
              "tip": 'Public'
            },
            "Pr": {
              "code": 'pr',
              "tip": 'Private'
            },
            "PM": {
              "code": 'prm',
              "tip": 'Private Members'
            },
            "H": {
              "code": 'hy',
              "tip": 'Hybrid'
            }
          }
        },

        "Act Origin": {
          "type": 'toggle',
          "section": 'origin',
          "items": {
            "Commons": {
              "code": 'commons',
              "tip": 'House of Commons'
            },
            "Lords": {
              "code": 'lords',
              "tip": "House of Lords"
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
            "Ld": {
              "code": 'party-liberal-democrat',
              "tip": 'Liberal Democrats',
              "cssClass": 'ldm'
            }
          }

        },

        "Filter Act Titles": {
          "type": 'search',
          "section": 'nameFilter',
          "items": {
            "name": {
              "cssClass": 'input-medium',
              "placeholder": 'Search Act by Title',
              "events": {
                "keyup": function(e) {
                  var $this = $(e.target),
                    term = $this.val().toLowerCase(),
                    ignore = [37, 39];

                  if (ignore.none(e.which) ) {
                    sandbox.publish('BillSearchName', term);
                  }
                }
              }
            }
          }
        }
      }
    });

    summary = summaryWidget({el: '#bills-summary'});

    bills = billWidget({
      el: '#bills',
      collectionRootPath: sandbox.routes.acts_path,
      commentsPath: sandbox.routes.comments_bill_path
    });

    summary.render().startLoader();

    //finalise bills/acts shared inits
    billsInit({
      summary: summary,
      bills: bills,
      sidebar: sidebar
    });

  }




});