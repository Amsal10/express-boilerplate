import { Request } from 'express';

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export class PaginationUtil {
  static getPaginationOptions(query: Record<string, unknown>): PaginationOptions {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = (query.sortOrder || 'desc') as 'asc' | 'desc';

    return { page, limit, sortBy, sortOrder };
  }

  static paginate<T>(data: T[], total: number, options: PaginationOptions): PaginationResult<T> {
    const { page = 1, limit = 10 } = options;
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    return {
      data: data.slice(skip, skip + limit),
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  static getSkip(options: PaginationOptions): number {
    const { page = 1, limit = 10 } = options;
    return (page - 1) * limit;
  }

  static createPaginationLinks(req: Request, page: number, totalPages: number) {
    const baseUrl = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query = new URLSearchParams(req.query as any);

    const links: Record<string, string> = {
      first: `${baseUrl}?page=1&${query.toString()}`,
      last: `${baseUrl}?page=${totalPages}&${query.toString()}`,
    };

    if (page < totalPages) {
      links.next = `${baseUrl}?page=${page + 1}&${query.toString()}`;
    }

    if (page > 1) {
      links.prev = `${baseUrl}?page=${page - 1}&${query.toString()}`;
    }

    return links;
  }
}
