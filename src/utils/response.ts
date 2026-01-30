export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  error?: {
    code?: string;
    details?: any;
  };
}

export class ResponseUtil {
  static success<T>(data: T, message = 'Success', meta?: any): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      meta,
    };
  }

  static error(message = 'An error occurred', code?: string, details?: any): ApiResponse {
    return {
      success: false,
      message,
      error: {
        code,
        details,
      },
    };
  }

  static paginated<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message = 'Success'
  ): ApiResponse<T[]> {
    return {
      success: true,
      message,
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
