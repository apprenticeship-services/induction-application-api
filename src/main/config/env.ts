export default {
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/cetb-node-api',
  port: process.env.PORT || 4000,
  salt: process.env.SALT || 12,
  emailService: process.env.MAIL_SERVICE || 'cetb_apprenticeship_service@outlook.com',
  emailServiceUser: process.env.MAIL_SERVICE_EMAIL || 'cetb_apprenticeship_service@outlook.com',
  emailServiceSecret: process.env.MAIL_SERVICE_EMAIL_SECRET || 'cetb2023'
}
