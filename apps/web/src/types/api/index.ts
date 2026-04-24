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

export type { ApiSuccessResponseT, ApiErrorResponseT };
