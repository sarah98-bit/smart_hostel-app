import "dotenv/config";

export default {
  expo: {
    name: "Smart Hostel",
    slug: "smart-hostel",
    version: "1.0.0",
     android: {
      package: "com.thuo.smarthostel",
    },
    ios: {
      bundleIdentifier: "com.thuo.smarthostel"
    },
    extra: {
  extra: {
  API_URL:
    process.env.API_URL_PROD ??
    process.env.API_URL_DEV
  },
      eas: {
        projectId: "1836db0e-5114-402f-a3d0-21fd8f945731"
      }
    },

     platforms: ["android", "ios", "web"]
  },
   
};
