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
      {
        method: 'POST',
        path: '/bookings/create-booking',
        handler: 'booking-email.createBooking',
        config: {
          policies: [],
          middlewares: [],
        },
      },
    ],
  };