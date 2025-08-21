export enum ResponseStatus {
  Success = "success",
  Failure = "failure",
}

export interface INextApiResponse<T = unknown> {
  statusCode?: number;
  status: ResponseStatus;
  data?: T;
  message?: string;
}
