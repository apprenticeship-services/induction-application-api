import nodemailer, { Transporter } from 'nodemailer'
import env from '@/main/config/env'
export class NodemailerHelper {
  static transporter: Transporter = null

  static init () {
    this.transporter = nodemailer.createTransport({
      service: env.emailService,
      auth: {
        user: env.emailServiceUser,
        pass: env.emailServiceSecret
      }
    })
    return this.transporter
  }
}
