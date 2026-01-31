import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../middleware/errorHandler';
import { config } from '../config';
import prisma from '../config/database';
import {
  RegisterInput,
  LoginInput,
  RefreshTokenInput,
  RequestPasswordResetInput,
  ResetPasswordInput,
  VerifyEmailInput,
  ResendVerificationInput,
} from '../validators/auth.validator';
import { generateUUID } from '../utils/uuid';
import emailService from './email.service';

class AuthService {
  async register(data: RegisterInput) {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    });

    if (existingUser) {
      throw new AppError(409, 'User with this email or username already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Generate verification token (valid for 24 hours)
    const verifyToken = generateUUID();
    const verifyTokenExpiresAt = new Date();
    verifyTokenExpiresAt.setHours(verifyTokenExpiresAt.getHours() + 24);

    const user = await prisma.user.create({
      data: {
        id: generateUUID(),
        email: data.email,
        password: hashedPassword,
        username: data.username,
        verifyToken,
        verifyTokenExpiresAt,
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    });

    // Send verification email
    try {
      await emailService.sendEmailVerificationEmail(user.email, user.username, verifyToken);
    } catch (error) {
      console.error('Failed to send verification email:', error);
    }

    // Send welcome email
    try {
      await emailService.sendWelcomeEmail(user.email, user.username);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }

    return user;
  }

  async login(data: LoginInput, ip?: string, userAgent?: string) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user?.isActive) {
      throw new AppError(401, 'Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid credentials');
    }

    const { accessToken, refreshToken } = await this.generateTokens(user.id, user.email, user.role);

    await this.saveRefreshToken(user.id, refreshToken);

    // Send login alert email
    try {
      await emailService.sendLoginAlertEmail(
        user.email,
        user.username,
        ip || 'unknown',
        userAgent ? `${userAgent}` : undefined
      );
    } catch (error) {
      console.error('Failed to send login alert email:', error);
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(data: RefreshTokenInput) {
    jwt.verify(data.refreshToken, config.jwt.secret) as {
      userId: string;
      email: string;
      role: string;
    };

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: data.refreshToken },
      include: { user: true },
    });

    if (!storedToken || storedToken.expiresAt < new Date() || !storedToken.user.isActive) {
      throw new AppError(401, 'Invalid or expired refresh token');
    }

    const { accessToken, refreshToken: newRefreshToken } = await this.generateTokens(
      storedToken.user.id,
      storedToken.user.email,
      storedToken.user.role
    );

    await prisma.refreshToken.delete({
      where: { id: storedToken.id },
    });

    await this.saveRefreshToken(storedToken.user.id, newRefreshToken);

    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(refreshToken: string) {
    await prisma.refreshToken.delete({
      where: { token: refreshToken },
    });
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const accessToken = jwt.sign({ userId, email, role }, config.jwt.secret, {
      expiresIn: config.jwt.accessExpiration,
    });

    const refreshToken = jwt.sign({ userId, email, role }, config.jwt.secret, {
      expiresIn: config.jwt.refreshExpiration,
    });

    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(userId: string, token: string) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        id: generateUUID(),
        token,
        userId,
        expiresAt,
      },
    });
  }

  async requestPasswordReset(data: RequestPasswordResetInput) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    // Don't reveal if user exists
    if (!user) {
      return {
        message: 'If an account with this email exists, a password reset email has been sent.',
      };
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = generateUUID();
    const resetTokenExpiresAt = new Date();
    resetTokenExpiresAt.setHours(resetTokenExpiresAt.getHours() + 1);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiresAt,
      },
    });

    // Send password reset email
    try {
      await emailService.sendPasswordResetEmail(user.email, user.username, resetToken);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
    }

    return {
      message: 'If an account with this email exists, a password reset email has been sent.',
    };
  }

  async resetPassword(data: ResetPasswordInput) {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: data.token,
        resetTokenExpiresAt: { gt: new Date() },
      },
    });

    if (!user) {
      throw new AppError(400, 'Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiresAt: null,
      },
    });

    return { message: 'Password has been reset successfully' };
  }

  async verifyEmail(data: VerifyEmailInput) {
    const user = await prisma.user.findFirst({
      where: {
        verifyToken: data.token,
        verifyTokenExpiresAt: { gt: new Date() },
      },
    });

    if (!user) {
      throw new AppError(400, 'Invalid or expired verification token');
    }

    if (user.isVerified) {
      throw new AppError(400, 'Email is already verified');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verifyToken: null,
        verifyTokenExpiresAt: null,
      },
    });

    return { message: 'Email verified successfully' };
  }

  async resendVerificationEmail(data: ResendVerificationInput) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    // Don't reveal if user exists
    if (!user) {
      return {
        message: 'If an account with this email exists, a verification email has been sent.',
      };
    }

    if (user.isVerified) {
      return { message: 'Email is already verified' };
    }

    // Generate new verification token (valid for 24 hours)
    const verifyToken = generateUUID();
    const verifyTokenExpiresAt = new Date();
    verifyTokenExpiresAt.setHours(verifyTokenExpiresAt.getHours() + 24);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verifyToken,
        verifyTokenExpiresAt,
      },
    });

    // Send verification email
    try {
      await emailService.sendEmailVerificationEmail(user.email, user.username, verifyToken);
    } catch (error) {
      console.error('Failed to send verification email:', error);
    }

    return { message: 'If an account with this email exists, a verification email has been sent.' };
  }
}

export default new AuthService();
