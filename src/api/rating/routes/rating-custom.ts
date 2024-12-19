// src/api/rating/routes/rating-custom.js

module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/users-with-ratings',
        handler: 'rating-custom.findUserRatings',
        config: {
          policies: [],
          middlewares: [],
        },
      },
      {
        method: 'POST',
        path: '/rate-user',
        handler: 'rating-custom.rateUser',
        config: {
          policies: [],
          middlewares: [],
        },
      }
    ],
  };
  