import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { ResponseUtil } from '../utils/response';

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(ResponseUtil.success(result, 'User registered successfully'));
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const ip = req.ip || req.socket.remoteAddress || 'unknown';
      const userAgent = req.get('user-agent');

      const result = await authService.login(req.body, ip, userAgent);
      res.status(200).json(ResponseUtil.success(result, 'Login successful'));
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.refreshToken(req.body);
      res.status(200).json(ResponseUtil.success(result, 'Token refreshed successfully'));
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.logout(req.body.refreshToken);
      res.status(200).json(ResponseUtil.success(null, 'Logout successful'));
    } catch (error) {
      next(error);
    }
  }

  async requestPasswordReset(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.requestPasswordReset(req.body);
      res.status(200).json(ResponseUtil.success(result, 'Password reset email sent successfully'));
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.resetPassword(req.body);
      res.status(200).json(ResponseUtil.success(result, 'Password reset successful'));
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.verifyEmail(req.body);
      res.status(200).json(ResponseUtil.success(result, 'Email verified successfully'));
    } catch (error) {
      next(error);
    }
  }

  async resendVerificationEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.resendVerificationEmail(req.body);
      res.status(200).json(ResponseUtil.success(result, 'Verification email sent successfully'));
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
