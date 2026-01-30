import { z } from 'zod';

export const updateUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format').optional(),
    username: z.string().min(3, 'Username must be at least 3 characters').optional(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid user ID'),
  }),
});

export const getUserSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid user ID'),
  }),
});

export const listUsersSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>['body'];
export type GetUserParams = z.infer<typeof getUserSchema>['params'];
export type ListUsersQuery = z.infer<typeof listUsersSchema>['query'];
