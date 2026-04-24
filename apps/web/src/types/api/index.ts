interface ApiResponseT<T> {
  success: boolean;
  data?: T;
  message: string;
  error?: {
    message: string;
    errors?: {
      field: string;
      message: string;
    }[];
  };
}

export type { ApiResponseT };
