export default {
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/cetb-node-api',
  port: process.env.PORT || 4000,
  salt: process.env.SALT || 12
}
