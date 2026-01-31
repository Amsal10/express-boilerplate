import nodemailer from 'nodemailer';
import { config } from '../config';
import logger from '../utils/logger';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.port === 465,
      auth: {
        user: config.email.user,
        pass: config.email.password,
      },
    });

    this.verifyConnection();
  }

  private async verifyConnection() {
    try {
      await this.transporter.verify();
      logger.info('Email service connected successfully');
    } catch (error) {
      logger.error('Email service connection failed', { error });
    }
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    if (!config.email.user || !config.email.password) {
      logger.warn('Email credentials not configured. Skipping email send.');
      return;
    }

    try {
      const mailOptions = {
        from: `${config.email.fromName} <${config.email.from}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info('Email sent successfully', {
        to: options.to,
        messageId: info.messageId,
      });
    } catch (error) {
      logger.error('Failed to send email', { error, to: options.to });
      throw error;
    }
  }

  async sendWelcomeEmail(email: string, username: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to ${config.email.fromName}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #4a90e2; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
              <h1 style="color: #fff; margin: 0;">Welcome to ${config.email.fromName}!</h1>
            </div>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px;">
              <p>Hi <strong>${username}</strong>,</p>
              <p>Welcome to ${config.email.fromName}! Your account has been successfully created.</p>
              <p>We're excited to have you on board. Here's what you can do next:</p>
              <ul>
                <li>Complete your profile</li>
                <li>Explore our features</li>
                <li>Connect with other users</li>
              </ul>
              <p>If you have any questions, feel free to reach out to our support team.</p>
              <p>Best regards,<br>The ${config.email.fromName} Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `Welcome to ${config.email.fromName}!

Hi ${username},

Welcome to ${config.email.fromName}! Your account has been successfully created.

We're excited to have you on board. Here's what you can do next:
- Complete your profile
- Explore our features
- Connect with other users

If you have any questions, feel free to reach out to our support team.

Best regards,
The ${config.email.fromName} Team`;

    await this.sendEmail({
      to: email,
      subject: `Welcome to ${config.email.fromName}`,
      html,
      text,
    });
  }

  async sendPasswordResetEmail(email: string, username: string, resetToken: string): Promise<void> {
    const resetUrl = `${config.frontendUrl}/reset-password?token=${resetToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #e74c3c; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
              <h1 style="color: #fff; margin: 0;">Password Reset Request</h1>
            </div>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px;">
              <p>Hi <strong>${username}</strong>,</p>
              <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
              <p>To reset your password, click the button below:</p>
              <p style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background: #e74c3c; color: #fff; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
              </p>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 3px;">${resetUrl}</p>
              <p><strong>This link will expire in 1 hour.</strong></p>
              <p>If you didn't request a password reset, please contact our support team immediately.</p>
              <p>Best regards,<br>The ${config.email.fromName} Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `Password Reset Request

Hi ${username},

We received a request to reset your password. If you didn't make this request, you can safely ignore this email.

To reset your password, visit this link: ${resetUrl}

This link will expire in 1 hour.

If you didn't request a password reset, please contact our support team immediately.

Best regards,
The ${config.email.fromName} Team`;

    await this.sendEmail({
      to: email,
      subject: 'Reset Your Password',
      html,
      text,
    });
  }

  async sendEmailVerificationEmail(
    email: string,
    username: string,
    verifyToken: string
  ): Promise<void> {
    const verifyUrl = `${config.frontendUrl}/verify-email?token=${verifyToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #4a90e2; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
              <h1 style="color: #fff; margin: 0;">Verify Your Email Address</h1>
            </div>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px;">
              <p>Hi <strong>${username}</strong>,</p>
              <p>Thank you for registering with ${config.email.fromName}! To complete your registration, please verify your email address.</p>
              <p>Click the button below to verify your email:</p>
              <p style="text-align: center; margin: 30px 0;">
                <a href="${verifyUrl}" style="background: #4a90e2; color: #fff; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
              </p>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 3px;">${verifyUrl}</p>
              <p><strong>This link will expire in 24 hours.</strong></p>
              <p>If you didn't create an account with ${config.email.fromName}, please ignore this email.</p>
              <p>Best regards,<br>The ${config.email.fromName} Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `Verify Your Email Address

Hi ${username},

Thank you for registering with ${config.email.fromName}! To complete your registration, please verify your email address.

Visit this link to verify: ${verifyUrl}

This link will expire in 24 hours.

If you didn't create an account with ${config.email.fromName}, please ignore this email.

Best regards,
The ${config.email.fromName} Team`;

    await this.sendEmail({
      to: email,
      subject: 'Verify Your Email Address',
      html,
      text,
    });
  }

  async sendAccountLockedEmail(email: string, username: string, reason: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Account Locked</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #f39c12; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
              <h1 style="color: #fff; margin: 0;">Account Locked</h1>
            </div>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px;">
              <p>Hi <strong>${username}</strong>,</p>
              <p>Your account has been locked due to: <strong>${reason}</strong></p>
              <p>If you believe this is an error, please contact our support team to unlock your account.</p>
              <p>Support Email: ${config.email.from}</p>
              <p>Best regards,<br>The ${config.email.fromName} Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `Account Locked

Hi ${username},

Your account has been locked due to: ${reason}

If you believe this is an error, please contact our support team to unlock your account.

Support Email: ${config.email.from}

Best regards,
The ${config.email.fromName} Team`;

    await this.sendEmail({
      to: email,
      subject: 'Account Locked - Action Required',
      html,
      text,
    });
  }

  async sendLoginAlertEmail(
    email: string,
    username: string,
    ip: string,
    location?: string
  ): Promise<void> {
    const loginTime = new Date().toLocaleString();

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Login Detected</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #27ae60; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
              <h1 style="color: #fff; margin: 0;">New Login Detected</h1>
            </div>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px;">
              <p>Hi <strong>${username}</strong>,</p>
              <p>We detected a new login to your account. If this was you, you can safely ignore this email.</p>
              <p><strong>Login Details:</strong></p>
              <ul>
                <li><strong>Time:</strong> ${loginTime}</li>
                <li><strong>IP Address:</strong> ${ip}</li>
                ${location ? `<li><strong>Location:</strong> ${location}</li>` : ''}
              </ul>
              <p>If you didn't log in, please contact our support team immediately and change your password.</p>
              <p>Best regards,<br>The ${config.email.fromName} Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `New Login Detected

Hi ${username},

We detected a new login to your account. If this was you, you can safely ignore this email.

Login Details:
- Time: ${loginTime}
- IP Address: ${ip}
${location ? `- Location: ${location}` : ''}

If you didn't log in, please contact our support team immediately and change your password.

Best regards,
The ${config.email.fromName} Team`;

    await this.sendEmail({
      to: email,
      subject: 'New Login Detected - Security Alert',
      html,
      text,
    });
  }
}

export default new EmailService();
