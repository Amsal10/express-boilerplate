import { AppError } from '../middleware/errorHandler';
import prisma from '../config/database';
import { PaginationUtil } from '../utils/pagination';

class UserService {
  async getUsers(options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;
    const skip = PaginationUtil.getSkip({ page, limit });

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count(),
    ]);

    return PaginationUtil.paginate(users, total, { page, limit, sortBy, sortOrder });
  }

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    return user;
  }

  async updateUser(id: string, data: { email?: string; username?: string }) {
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new AppError(404, 'User not found');
    }

    if (data.email && data.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (emailExists) {
        throw new AppError(409, 'Email already in use');
      }
    }

    if (data.username && data.username !== existingUser.username) {
      const usernameExists = await prisma.user.findUnique({
        where: { username: data.username },
      });

      if (usernameExists) {
        throw new AppError(409, 'Username already in use');
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(data.email && { email: data.email }),
        ...(data.username && { username: data.username }),
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  async deleteUser(id: string) {
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new AppError(404, 'User not found');
    }

    await prisma.user.delete({
      where: { id },
    });
  }
}

export default new UserService();
