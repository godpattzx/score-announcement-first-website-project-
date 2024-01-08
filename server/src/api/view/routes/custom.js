'use strict';


module.exports = {
  routes: [ //custom routes
    {
      method: 'GET',
      path: '/views/:id/seen',
      handler: 'view.seen'
    }
  ]
}