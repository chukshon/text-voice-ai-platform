interface ApiSuccessResponseT<T> {
  success: boolean;
  data?: T;
  message: string;
}

interface ApiErrorResponseT {
  success: boolean;
  message: string;
  errors?: {
    field: string;
    message: string;
  }[];
}

interface ApiPaginationResponseT<T> {
  pagination: {
    totalCount: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
    skip: number;
  };
  data: T[];
}

export type { ApiSuccessResponseT, ApiErrorResponseT, ApiPaginationResponseT };
