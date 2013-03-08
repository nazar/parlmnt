define([
  'sandbox',

  'widgets/bill/main',
  'widgets/sponsor/main',

  'widgets/sidebar/main',
  'widgets/summary/main',

  'modules/common/shared_global_init',
  'modules/common/bills_pub_sub_init'

], function (sandbox, billWidget, sponsorWidget, sidebarWidget, summaryWidget, globalInit, billsInit)  {


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
              "tip": 'Bills in 2013'
            },
            "2012": {
              "tip": 'Bills in 2012'
            },
            "2011": {
              "tip": 'Bills in 2011'
            },
            "2010": {
              "tip": 'Bills in 2010'
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

        "Bill Type": {
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

        "Bill Origin": {
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

        "Bill Stage": {
          "type": 'toggle',
          "section": 'stage',
          "items": {
            "1": {
              "code": "1st",
              "tip": 'First Reading'
            },
            "2": {
              "code": "2nd",
              "tip": 'Second Reading'
            },
            "C": {
              "code": "co",
              "tip": 'Committee'
            },
            "3": {
              "code": "3rd",
              "tip": 'Third Reading'
            },
            "A": {
              "code": "am",
              "tip": 'Amendments'
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

        "Filter Bill Titles": {
          "type": 'search',
          "section": 'nameFilter',
          "items": {
            "name": {
              "cssClass": 'input-medium',
              "placeholder": 'Search Bill by Title',
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
      collectionRootPath: sandbox.routes.bills_path,
      commentsPath: sandbox.routes.comments_bill_path
    });

    sponsorWidget({
      commentsPath: sandbox.routes.comments_lord_path
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