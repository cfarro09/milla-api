module.exports = {
    apps: [
      {
        name: "strapi",
        script: "npm",
        args: "start",
        env: {
          NODE_ENV: "production",
          NODE_VERSION: "18.0.0",
        },
      },
    ],
  };
  