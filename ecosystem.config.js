module.exports = {
    apps: [
      {
        name: "strapi",
        script: "npm",
        args: "start",
        env: {
          NODE_ENV: "production",
        },
      },
    ],
  };
  