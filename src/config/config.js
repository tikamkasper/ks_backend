const _config = {
  port: process.env.PORT,
  db_name: process.env.DB_NAME,
  mogodb_uri: process.env.MONGODB_URI,
  cors_origin: process.env.CORS_ORIGIN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY,
  refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
  refresh_token_expiry: process.env.REFRESH_TOKEN_EXPIRY,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
};

const config = {
  get(key) {
    const value = _config[key];
    if (!value) {
      console.error(
        `The variable ${key} not found . And make sure to pass environment variables}`
      );
      // throw new Error(`The variable ${key} not found . And make sure to pass environment variables}`);
      process.exit();
    }
    return value;
  },
};
// const config = Object.freeze(_config);
module.exports = config;
