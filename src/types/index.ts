export interface Book {
  id: bigint;
  title: string;
  author: string;
  year: number;
  price: string;
  is_active: boolean;
  description?: string | null;
}

export interface BookCreateInput {
  title: string;
  author: string;
  year: number;
  price: number;
  description?: string;
  is_active?: boolean;
}

export interface BookUpdateInput extends Partial<BookCreateInput> {
  id: bigint;
}

export interface BookQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  year?: number;
  author?: string;
  is_active?: boolean;
  sort_by?: 'id' | 'title' | 'author' | 'year' | 'price';
  sort_order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface ErrorResponse {
  success: boolean;
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
}
