require("dotenv").config();
const appSettings = {
  appCredentials: {
    clientId: process.env.CLIENT_ID,
    tenantId: process.env.CLIENT_TENANT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  },
  authRoutes: {
    redirect: process.env.REDIRECT_URL,
    unauthorized: "/unauthorized", // the wrapper will redirect to this route in case of unauthorized access attempt
  },
  b2cPolicies: {
    signUpSignIn: {
      // the first policy under b2cPolicies will be used as default authority
      authority: process.env.CLOUD_INSTANCE,
    },
  },
};

module.exports = appSettings;
