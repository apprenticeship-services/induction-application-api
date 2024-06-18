export default {
  nodeEnvironment: process.env.NODE_ENV || 'development',
  urlSite: process.env.URL_SITE || 'http://localhost:8080',
  mongoUri: process.env.MONGO_URL || 'mongodb://localhost:27017/cetb-node-api',
  port: process.env.PORT || 4000,
  salt: Number(process.env.SALT) || 12,
  jwtSecretToken: process.env.JSON_SECRET_TOKEN || '8DB3B6393AA5BC15120CCE32A610EFB8B88DCF6E27D68F681C53D48894D44B2C',
  emailService: process.env.MAIL_SERVICE || 'Outlook365',
  emailServiceUser: process.env.MAIL_SERVICE_EMAIL || 'cetb_apprenticeship_service@outlook.com',
  emailServiceSecret: process.env.MAIL_SERVICE_EMAIL_SECRET || 'cetb2023'
}
