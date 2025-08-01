module.exports = {
  authenticateRoutes: {
    path: [
      { url: "/auth/sign-up", methods: ["POST"] },
      { url: "/auth/login", methods: ["POST"] },
      { url: "/auth/logout", methods: ["POST"] },
      // { url: "/users", methods: ["GET"] },
    ]
  }
};
