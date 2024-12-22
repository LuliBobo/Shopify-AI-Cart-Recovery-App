const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendEmail({ to, subject, html }) {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM,
        to,
        subject,
        html
      };

      return await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error(`Email sending failed: ${error.message}`);
    }
  }
}

module.exports = new EmailService();