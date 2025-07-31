module.exports = {
  authenticateRoutes: {
    path: [
      { url: "/sign-up", method: "POST" },
      { url: "/login", method: "POST" },
      { url: "/otp", method: "POST" },
      { url: "/get-sstoken", method: "POST" },
      { url: "/invite-agent", method: "POST" },
      { url: "/get-code", method: "GET" },
      { url: "/get-user-info", method: "POST" },
      { url: "/change-balance", method: "POST" },
      // { url: "/show-host-level-info", method: "GET" },
      // { url: "/show-sender-level-info", method: "GET" },
    
      // { url: "/^\/api\/v1\/test\/*/", method: "PATCH" },
    ],
  },
};
