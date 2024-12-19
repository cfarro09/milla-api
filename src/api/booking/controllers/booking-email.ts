
module.exports = {
    async sendBookingEmail(ctx) {
        const { id } = ctx.params;

        try {
            // Obtener la información del booking
            const booking = await strapi.entityService.findOne('api::booking.booking', id, {
                populate: ['activity', 'schedulesSelected', 'level', 'age', 'price', 'persons', 'creator'],
            });

            const notificationEmails = process.env.NOTIFICATION_EMAILS;
            const emailsList = notificationEmails.split(',');
            if (!booking) {
                return ctx.notFound('Booking not found');
            }
            emailsList.push(booking.creator.email);
            console.log("booking", JSON.stringify(booking))
            // Preparar el contenido del correo
            const emailContent = `
               <!DOCTYPE html> <html lang="es"> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Confirmación de Reserva</title> </head> <body style="font-family: BlinkMacSystemFont,-apple-system,Roboto,Helvetica,Arial,sans-serif; background-color: #f4f4f4; padding: 20px; font-size: 14px; color: rgb(51,51,51)"> <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 10px;"> <h1 style="color: #333;">¡Gracias, ${booking.creator.name}! Estás a 1 paso de confirmar tu reserva.</h1> <p>✅ El <strong>${booking.activity.name}</strong> te espera el <strong>${new Date(booking.startDate).toLocaleDateString()}</strong>, solo falta realizar el pago del servicio.</p> <p>✅ Tu pago deberá ser gestionado a través de Plin o Yape. Debajo encontrarás toda la información necesaria para realizarlo.</p> <p>✅ Posterior al pago, <strong>${booking.activity.name}</strong>, te enviará por correo la confirmación del inicio de clase o actividad.</p> <p>✅ Recuerda, si necesitas realizar algún cambio con respecto al día o a la hora de la clase/actividad, podrás realizarlo posterior al pago en coordinación con <strong>${booking.activity.name}</strong>.</p> <h3>Datos de la reserva</h3> <table style="width: 100%; border-collapse: collapse; margin-top: 10px;"> <tr> <td colspan="2" style="border: 1px solid #ddd; padding: 12px;">${booking.activity.name}</td> </tr> <tr> <td style="border: 1px solid #ddd; border-right: none; padding: 12px;">Inicio</td> <td style="border: 1px solid #ddd; border-left: none; padding: 12px;">${new Date(booking.startDate).toLocaleDateString()} (hora: ${new Date(booking.startDate).toLocaleTimeString()})</td> </tr> <tr> <td style="border: 1px solid #ddd; border-right: none; padding: 12px;">Tu reserva</td> <td style="border: 1px solid #ddd; border-left: none; padding: 12px;">${booking.level?.name || 'Nivel no especificado'} - ${booking.age?.name || 'Edad no especificada'}</td> </tr> <tr> <td style="border: 1px solid #ddd; border-right: none; padding: 12px;">Reservaste para</td> <td style="border: 1px solid #ddd; border-left: none; padding: 8px;">${booking.persons?.map(person => person.name).join(', ')}</td> </tr> <tr> <td style="border: 1px solid #ddd; border-right: none; padding: 12px;">Ubicación:</td> <td style="border: 1px solid #ddd; border-left: none; padding: 8px;"> <a href="https://www.google.com/maps?q=${booking.activity.lat},${booking.activity.lng}" target="_blank">${booking.activity.address}</a> </td>            </tr> <tr> <td style="border: 1px solid #ddd; border-right: none; padding: 12px;">Pago por adelantado</td> <td style="border: 1px solid #ddd; border-left: none; padding: 12px;">Pagarás por adelantado el precio de la clase / actividad, hasta 5 días  antes de la fecha de inicio.</td> </tr> </table> <h3>Desglose del precio</h3> <table style="width: 100%; border-collapse: collapse; margin-top: 10px; background-color: #f5f5f5; padding: 16px"> <tr> <td style="border: 1px solid #ddd; padding: 24px 16px;"><strong>Precio:</strong></td> <td style="border: 1px solid #ddd; padding: 24px 16px;">S/.${(booking.price?.value || 0).toFixed(2)}</td> </tr> </table> <h3>Forma de pago</h3> <p>Plin o Yape: ${booking.activity.phonetopay || ""}</p> <footer style="margin-top: 20px; background-color: #f5f5f5; padding: 16px"> <p style="font-weight: bold; font-size: 16px;">Riya</p> <p>Al interactuar con la aplicación y al realizar una reserva a través de ella, estás aceptando nuestros <a href="https://example.com/terminos" target="_blank">Términos y Condiciones</a> y <a href="https://example.com/privacidad" target="_blank">Política de Privacidad</a>.</p> </footer> </div> </body> </html>
                `;

            // Enviar el correo
            await strapi.plugins['email'].services.email.send({
                to: emailsList.join(','),
                from: process.env.GMAIL_USER,
                subject: '😎¡Gracias! Estás a 1 paso de confirmar tu reserva.',
                text: emailContent,
            });

            ctx.send({ message: 'Correo de confirmación enviado con éxito' });
        } catch (error) {
            console.error('Error al enviar el correo de confirmación:', error);
            ctx.internalServerError('Error al enviar el correo de confirmación');
        }
    },
};