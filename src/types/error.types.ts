export type ErrorSeverity = "error" | "warning" | "info";

export interface AppError {
  message: string;
  code?: string | number;
  severity?: ErrorSeverity;
  timestamp?: number;
  details?: unknown;
}

export interface ValidationError extends AppError {
  field?: string;
  value?: unknown;
}

export type ErrorAction = {
  label: string;
  handler: () => void;
};
