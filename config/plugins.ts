export default ({ env }) => ({
    'users-permissions': {
        config: {
            jwt: {
                expiresIn: '60d',
            },
        },
    },
    email: {
        config: {
            provider: 'nodemailer',
            providerOptions: {
                host: 'smtp.gmail.com',
                port: 587,
                auth: {
                    user: env('GMAIL_USER'), // Aquí pones tu correo de Gmail
                    pass: env('GMAIL_PASSWORD'), // Aquí pones tu contraseña de Gmail
                },
                // Si usas el puerto 465, también debes agregar:
                // secure: true,
            },
            settings: {
                defaultFrom: env('GMAIL_USER'), // Tu correo de Gmail
                defaultReplyTo: env('GMAIL_USER'), // Tu correo de Gmail
            },
        },
    },
});
