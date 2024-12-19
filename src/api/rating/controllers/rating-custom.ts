// src/api/rating/controllers/rating-custom.js

module.exports = {
    async rateUser(ctx) {
        const { from_user, admin_user, rating } = ctx.request.body;
        
        // Verificar si el registro ya existe usando la relación correcta
        const existingRating = await strapi.db.query('api::rating.rating').findOne({
            where: {
                from_user: { id: from_user },  // Relación 'from_user' especificada con 'id'
                admin_user: { id: admin_user },  // Relación 'admin_user' especificada con 'id'
            },
        });

        if (existingRating) {
            // Si el registro ya existe, actualiza el rating
            const updatedRating = await strapi.db.query('api::rating.rating').update({
                where: { id: existingRating.id },
                data: { rating: rating },
            });
            ctx.send({ message: 'Rating updated', updatedRating });
        } else {
            // Si no existe, crea un nuevo registro
            const newRating = await strapi.db.query('api::rating.rating').create({
                data: {
                    from_user,
                    admin_user,
                    rating: rating,
                },
            });
            ctx.send({ message: 'Rating created', newRating });
        }
    },
    async findUserRatings(ctx) {
        const currentUser = ctx.state.user;
        // Obtener todos los usuarios y poblar el campo 'picture'

        const users = await strapi.query('plugin::users-permissions.user').findMany({
            populate: ['picture'], // Asegurarnos de incluir el campo 'picture'
        });

        // Para cada usuario, calcular el promedio de los ratings
        const usersWithRatings = await Promise.all(
            users.map(async (user) => {
                // Obtener los ratings de este usuario
                const ratings = await strapi.query('api::rating.rating').findMany({
                    where: { admin_user: user.id },
                    populate: ['from_user'], // Poblar el campo 'from_user'
                });
                const userRating = ratings.find(rating => rating.from_user?.id === currentUser?.id);

                // Calcular el promedio
                const totalRatings = ratings.reduce((sum, rating) => sum + rating.rating, 0);
                const avgRating = ratings.length > 0 ? totalRatings / ratings.length : 0;

                return {
                    ...user,
                    avgRating: avgRating.toFixed(2), // Devolver el promedio con 2 decimales
                    userRating: userRating ? userRating.rating : 0
                };
            })
        );

        // Enviar la respuesta con el campo adicional del promedio de rating
        ctx.send(usersWithRatings);
    }
};