module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/bookings/:id/send-email',
        handler: 'booking-email.sendBookingEmail',
        config: {
          policies: [],
          middlewares: [],
        },
      },
    ],
  };