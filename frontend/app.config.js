import "dotenv/config";

export default {
  expo: {
    name: "Smart Hostel",
    slug: "smart-hostel",
    version: "1.0.0",
    extra: {
      API_URL: process.env.API_URL,
    },
  },
};
