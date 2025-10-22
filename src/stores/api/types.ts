export type BaseResponse<T = any> = {
  success: boolean;
  message?: string;
  data?: T;
};
