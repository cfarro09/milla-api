/**
 * A set of functions called "actions" for `login`
 */

const cleanSensitive = (user) => {
  const finalUser = { ...user };
  delete finalUser.password;
  delete finalUser.auth0Id;
  delete finalUser.resetPasswordToken;
  delete finalUser.confirmationToken;
  delete finalUser.provider;
  return finalUser;
}


export default {
  login: async (ctx, next) => {
    try {
      const { jwt } = ctx.request.body;
      const response = await fetch ('https://milla.us.auth0.com/userinfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`
        }
      });

      const result: any = await response.text();

      if(result.toString() == 'Unauthorized')
        return ctx.badRequest('JWT Unauthorized - Outdated', { message: result });

      const userInfo =  JSON.parse(result);

      const resultFinal = await strapi.services['plugin::users-permissions.user'].fetchAll({ 
        filters: { email: userInfo?.email },
        populate: ['role', 'foto']
      });
      const user = resultFinal[0];

      if(!user)
        return ctx.badRequest('No se encuentra el usuario con ese email', { user });

      const jwtStrapi = await strapi.services['plugin::users-permissions.jwt'].issue(cleanSensitive(user));
      ctx.body = { jwt: jwtStrapi, user: cleanSensitive(user) };
    } catch (err) {
      ctx.body = err;
    }
  }
};
