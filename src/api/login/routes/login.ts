export default {
  routes: [
    {
     method: 'POST',
     path: '/login',
     handler: 'login.login',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
